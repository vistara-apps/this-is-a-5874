-- CitizenShield Database Schema
-- This file contains the complete database schema for the CitizenShield application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('free', 'premium');
CREATE TYPE language_preference AS ENUM ('en', 'es');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    subscription_status subscription_status DEFAULT 'free',
    state_preference TEXT DEFAULT 'CA',
    language_preference language_preference DEFAULT 'en',
    stripe_customer_id TEXT,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encounters table
CREATE TABLE public.encounters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    recording_url TEXT,
    summary_content TEXT NOT NULL,
    shared_with TEXT[] DEFAULT '{}',
    notes TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights content table
CREATE TABLE public.rights_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state TEXT NOT NULL,
    language language_preference NOT NULL,
    rights_text TEXT NOT NULL,
    script_text TEXT NOT NULL,
    guide_steps TEXT[] NOT NULL,
    silent_right TEXT NOT NULL,
    search_rights TEXT NOT NULL,
    recording_rights TEXT NOT NULL,
    state_specific TEXT NOT NULL,
    id_requirements TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state, language)
);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
    features TEXT[] NOT NULL,
    stripe_price_id TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions/activity log
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared encounters table (for tracking who encounters are shared with)
CREATE TABLE public.shared_encounters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE CASCADE NOT NULL,
    shared_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    shared_with_email TEXT NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_encounters_user_id ON public.encounters(user_id);
CREATE INDEX idx_encounters_timestamp ON public.encounters(timestamp DESC);
CREATE INDEX idx_rights_content_state_lang ON public.rights_content(state, language);
CREATE INDEX idx_shared_encounters_encounter_id ON public.shared_encounters(encounter_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rights_content_updated_at BEFORE UPDATE ON public.rights_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only see their own encounters
CREATE POLICY "Users can view own encounters" ON public.encounters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encounters" ON public.encounters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own encounters" ON public.encounters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own encounters" ON public.encounters
    FOR DELETE USING (auth.uid() = user_id);

-- Users can view shared encounters they created or that were shared with them
CREATE POLICY "Users can view relevant shared encounters" ON public.shared_encounters
    FOR SELECT USING (
        auth.uid() = shared_by OR 
        auth.email() = shared_with_email
    );

CREATE POLICY "Users can create shared encounters for their own encounters" ON public.shared_encounters
    FOR INSERT WITH CHECK (
        auth.uid() = shared_by AND
        EXISTS (
            SELECT 1 FROM public.encounters 
            WHERE id = encounter_id AND user_id = auth.uid()
        )
    );

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rights content is publicly readable
CREATE POLICY "Rights content is publicly readable" ON public.rights_content
    FOR SELECT USING (true);

-- Subscription plans are publicly readable
CREATE POLICY "Subscription plans are publicly readable" ON public.subscription_plans
    FOR SELECT USING (true);

-- Create storage bucket for recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Storage policies for recordings
CREATE POLICY "Users can upload their own recordings" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own recordings" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own recordings" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Insert default subscription plans
INSERT INTO public.subscription_plans (id, name, price_cents, interval, features, stripe_price_id) VALUES
('premium_monthly', 'Premium Monthly', 499, 'month', 
 ARRAY['State-specific legal information', 'Multilingual support (English & Spanish)', 'Encrypted cloud storage for recordings', 'Advanced sharing options', 'Priority customer support'], 
 'price_premium_monthly'),
('premium_yearly', 'Premium Yearly', 4999, 'year', 
 ARRAY['State-specific legal information', 'Multilingual support (English & Spanish)', 'Encrypted cloud storage for recordings', 'Advanced sharing options', 'Priority customer support', '2 months free (save 17%)'], 
 'price_premium_yearly');

-- Insert default rights content for major states
INSERT INTO public.rights_content (state, language, rights_text, script_text, guide_steps, silent_right, search_rights, recording_rights, state_specific, id_requirements) VALUES
('CA', 'en', 
 'California provides strong protections for citizen rights during police encounters.',
 'California-specific phrases and rights to remember.',
 ARRAY['Stay calm and keep your hands visible', 'You are not required to provide ID unless driving or lawfully arrested', 'Clearly state: "I am exercising my right to remain silent"', 'California is a two-party consent state for audio recording', 'You may record video of police in public without consent', 'Do not consent to searches: "I do not consent to any searches"'],
 'Under California law and the Fifth Amendment, you have the right to remain silent. You are not required to answer questions about where you are going, where you came from, or what you are doing.',
 'California requires clear consent for searches. Police cannot search you, your car, or your home without a warrant, probable cause, or your consent. Never consent to searches.',
 'In California, you may record video of police officers in public. However, California requires two-party consent for audio recording, so be careful about recording audio without permission.',
 'California does not have a "stop and identify" law. You are only required to provide ID if you are driving, lawfully arrested, or in specific circumstances like purchasing alcohol.',
 'California does not require you to carry or show ID unless you are driving a vehicle, have been lawfully arrested, or are in certain regulated activities.'),

('NY', 'en',
 'New York provides constitutional protections during police encounters.',
 'New York-specific rights and phrases to remember.',
 ARRAY['Stay calm and keep your hands visible', 'You are not required to provide ID unless lawfully arrested', 'Clearly state: "I am exercising my right to remain silent"', 'New York is a one-party consent state for recording', 'You may record police officers in public', 'Do not consent to searches: "I do not consent to any searches"'],
 'You have the right to remain silent under the Fifth Amendment. In New York, you are not required to answer questions beyond providing identification when lawfully required.',
 'New York law requires probable cause or a warrant for most searches. You have the right to refuse consent to searches. Police may still search if they have legal justification.',
 'New York is a one-party consent state, meaning you can record conversations you are part of. You may also record police officers performing duties in public.',
 'New York has specific laws regarding police encounters. The NYPD has specific protocols for stops and searches that officers must follow.',
 'New York does not have a general "stop and identify" law. You are only required to provide ID when lawfully arrested or in specific circumstances.'),

('TX', 'en',
 'Texas law provides specific protections and requirements during police encounters.',
 'Texas-specific rights and legal requirements.',
 ARRAY['Stay calm and keep your hands visible', 'Texas has a "stop and identify" law - you must provide name if lawfully detained', 'Clearly state: "I am exercising my right to remain silent"', 'Texas is a one-party consent state for recording', 'You may record police officers in public', 'Do not consent to searches: "I do not consent to any searches"'],
 'You have the right to remain silent under the Fifth Amendment. However, Texas has a "stop and identify" law requiring you to provide your name if lawfully detained.',
 'Texas law requires probable cause or consent for searches. You have the right to refuse consent, but police may search if they have probable cause or other legal justification.',
 'Texas is a one-party consent state. You may record police officers performing their duties in public places without their consent.',
 'Texas Penal Code Section 38.02 requires you to provide your name (but not ID) if lawfully detained and the officer requests it. Failure to provide your name can result in arrest.',
 'Texas law requires you to provide your name if lawfully detained and asked by an officer. You are not required to provide physical ID unless driving or under arrest.');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_encounter_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.encounters WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid UUID)
RETURNS subscription_status AS $$
BEGIN
    RETURN (
        SELECT 
            CASE 
                WHEN subscription_expires_at IS NULL OR subscription_expires_at < NOW() THEN 'free'::subscription_status
                ELSE subscription_status
            END
        FROM public.users 
        WHERE id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.rights_content TO anon;
GRANT SELECT ON public.subscription_plans TO anon;
