import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand-200 dark:bg-brand-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 dark:bg-emerald-900 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>✨</span>
          <span>AI-Powered for Food Businesses</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Write Product Descriptions{" "}
          <span className="text-brand-600 dark:text-brand-400">
            in Seconds
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enter your product details, choose a tone, and let AI generate
          professional descriptions for your food products instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate" className="btn-primary text-base px-8 py-4">
            Generate Description Free →
          </Link>
          <Link href="/about" className="btn-secondary text-base px-8 py-4">
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
          {[
            { value: "3", label: "Writing Tones" },
            { value: "10s", label: "Generation Time" },
            { value: "Free", label: "To Get Started" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
