export default function Loader({ text = "Generating..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="w-10 h-10 border-4 border-brand-200 dark:border-brand-800 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{text}</p>
    </div>
  );
}
