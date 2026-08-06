export default function Card({ icon, title, description, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {icon && (
        <div className="text-3xl mb-4">{icon}</div>
      )}
      {title && (
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}