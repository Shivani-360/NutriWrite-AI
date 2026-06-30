import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">
            NutriWrite AI
          </span>
        </div>

        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
          <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
          <Link href="/generate" className="hover:text-gray-900 dark:hover:text-white transition-colors">Generate</Link>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} NutriWrite AI. Built with ❤️
        </p>
      </div>
    </footer>
  );
}
