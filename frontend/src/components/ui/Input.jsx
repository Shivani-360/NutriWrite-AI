export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  hint,
  multiline = false,
  rows = 3,
}) {
  const fieldClass = "input-field";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${fieldClass} resize-none`}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={fieldClass}
          required={required}
        />
      )}
      {hint && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>
      )}
    </div>
  );
}
