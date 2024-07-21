import React from 'react'

export const NpButton = ({
  onClick,
  children,
  className = '',
  ...props
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white text-xs px-2 py-1 rounded-sm hover:bg-blue-700 ${className || ''}
    ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    {...props}
  >
    {children}
  </button>
)
