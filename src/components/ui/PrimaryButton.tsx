import React from 'react'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'outline' | 'danger'
  className?: string
  disabled?: boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'default',
  className = '',
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    default: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    outline: 'border border-white/30 text-white hover:bg-white/10 focus:ring-white',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}