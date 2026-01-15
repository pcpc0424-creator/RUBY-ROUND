export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '선택해주세요',
  required = false,
  error,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-ruby-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-dark-800 border rounded-lg text-white
          focus:outline-none focus:ring-2 transition-all duration-300 appearance-none
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-dark-600 focus:border-ruby-500 focus:ring-ruby-500/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${!value ? 'text-gray-500' : ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
          paddingRight: '40px',
        }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
