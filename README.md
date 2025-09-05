# CitizenShield

**Know your rights, protect yourself.**

CitizenShield is a mobile-first web application that provides instant access to legal rights, actionable scripts, and documentation tools for individuals during police encounters.

## 🚀 Features

### Core Features
- **On-Demand Rights & Scripts**: Mobile-optimized guides on user rights during police encounters with pre-written phrases and step-by-step instructions in English and Spanish
- **One-Tap Incident Recorder**: Quick audio/video recording with automatic metadata capture (time, location)
- **Shareable Encounter Summary**: Generate concise, shareable summaries for trusted contacts

### Premium Features
- State-specific legal information
- Multilingual support (English & Spanish)
- Encrypted cloud storage for recordings
- Advanced sharing options
- Priority customer support

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Services**: OpenAI API for script generation and summaries
- **Payments**: Stripe for subscription management
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd citizenshield
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Development Settings
VITE_ENABLE_MOCK_APIS=true
VITE_DEBUG_MODE=true
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database schema:

```sql
-- Copy and paste the contents of database/schema.sql into your Supabase SQL editor
```

3. Set up storage bucket for recordings (done automatically by schema)

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── RightsGuide.tsx # Rights information display
│   └── RecordingInterface.tsx # Recording functionality
├── services/           # External service integrations
│   ├── supabase.ts    # Database and auth
│   ├── openai.ts      # AI script generation
│   └── stripe.ts      # Payment processing
├── stores/            # State management
│   └── useUserStore.ts # User and encounter state
├── data/              # Static data and content
│   └── rightsContent.ts # Legal rights information
└── App.tsx            # Main application component

database/
└── schema.sql         # Complete database schema

public/                # Static assets
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(220 80% 50%)` - Blue for primary actions
- **Accent**: `hsl(140 60% 45%)` - Green for positive actions
- **Danger**: `hsl(0 80% 50%)` - Red for warnings/stop actions
- **Neutral**: Various shades for text and backgrounds

### Typography
- **Display**: Large headings (text-4xl font-semibold)
- **Heading**: Section headings (text-2xl font-bold)
- **Body**: Regular text (text-base leading-7)
- **Caption**: Small text (text-sm font-medium)

### Components
- **PrimaryButton**: Main action buttons with variants
- **Card**: Content containers with consistent styling
- **InfoModal**: Rights and script information display
- **RecordButton**: Prominent recording interface

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database schema from `database/schema.sql`
4. Configure Row Level Security policies (included in schema)

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add to environment variables
3. Monitor usage for cost management

### Stripe Setup

1. Create a Stripe account
2. Get publishable key from dashboard
3. Set up webhook endpoints for subscription management
4. Configure products and prices to match subscription plans

## 📱 Mobile Optimization

The application is designed mobile-first with:

- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized for one-handed use
- Fast loading and minimal data usage
- Progressive Web App capabilities

## 🔒 Security & Privacy

- **End-to-end encryption** for sensitive recordings
- **Row Level Security** in database
- **Secure authentication** via Supabase Auth
- **GDPR compliant** data handling
- **No tracking** of user locations without consent

## 🌍 Internationalization

Currently supports:
- **English** (en) - Full support
- **Spanish** (es) - Partial support with expansion planned

Adding new languages:
1. Add language to `language_preference` enum in database
2. Update rights content in `src/data/rightsContent.ts`
3. Add translations to UI components

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Analytics & Monitoring

- **Error tracking**: Integrated error boundaries
- **Performance monitoring**: Web Vitals tracking
- **User analytics**: Privacy-focused usage metrics
- **Uptime monitoring**: Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

## 📄 Legal Disclaimer

CitizenShield provides general information about legal rights and is not a substitute for professional legal advice. Users should consult with qualified attorneys for specific legal situations. The application developers are not responsible for the accuracy of legal information or outcomes of police encounters.

## 📞 Support

- **Documentation**: [Link to docs]
- **Issues**: GitHub Issues
- **Email**: support@citizenshield.com
- **Community**: [Discord/Forum link]

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Legal rights information sourced from ACLU and EFF resources
- State-specific legal research from qualified legal professionals
- Community feedback and testing from civil rights organizations

---

**Built with ❤️ for civil rights and community safety**
