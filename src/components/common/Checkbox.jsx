export default function Checkbox({
  label,
  description,
  name,
  checked,
  onChange,
  required = false,
  error,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`${className}`}>
      <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="flex items-center h-6">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="w-5 h-5 bg-dark-800 border-2 border-dark-500 rounded text-ruby-600
              focus:ring-ruby-500 focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent
              checked:bg-ruby-600 checked:border-ruby-600 transition-all duration-200
              cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <span className={`text-sm font-medium ${error ? 'text-red-400' : 'text-gray-200'}`}>
            {label}
            {required && <span className="text-ruby-500 ml-1">*</span>}
          </span>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-400 ml-8">{error}</p>
      )}
    </div>
  );
}
