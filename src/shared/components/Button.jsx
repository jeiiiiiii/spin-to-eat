const variantStyles = {
  primary: 'bg-[#0067A5] hover:bg-[#004F80] text-white disabled:bg-[#D1D5DB] disabled:text-[#9CA3AF]',
  secondary: 'border-2 border-[#0067A5] text-[#0067A5] hover:bg-[#E6F2FA] disabled:border-[#D1D5DB] disabled:text-[#9CA3AF]',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
