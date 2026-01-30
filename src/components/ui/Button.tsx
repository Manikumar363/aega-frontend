import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'auth' | 'secondary' | 'outline' | 'ghost' | 'social';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Standard Blue for Landing Page
    primary: "bg-blue-600 hover:bg-blue-700 border-transparent text-white shadow-sm focus:ring-blue-500",
    
    // Orange for Auth Pages (Matches your Figma screenshot)
    auth: "bg-orange-500 hover:bg-orange-600 text-white border-transparent shadow-sm focus:ring-orange-500 w-full",
    
    // Secondary/White
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm focus:ring-gray-500",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    
    // Social Login Buttons
    social: "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 shadow-sm w-full flex gap-2 justify-center"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};