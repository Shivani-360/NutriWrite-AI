import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Generation",
    description: "Uses Google Gemini AI to craft compelling, human-quality product descriptions tailored for food products.",
  },
  {
    icon: "🎨",
    title: "3 Writing Tones",
    description: "Choose Premium, Traditional, or Health-Focused tone to match your brand's personality perfectly.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description: "Get a professional product description in under 10 seconds. No waiting, no writing skills needed.",
  },
  {
    icon: "📋",
    title: "One-Click Copy",
    description: "Copy your generated description instantly and paste it wherever you need — website, Amazon, or packaging.",
  },
  {
    icon: "🔄",
    title: "Regenerate Anytime",
    description: "Not satisfied? Regenerate to get a fresh new version of your description with a single click.",
  },
  {
    icon: "🌿",
    title: "Food Industry Focused",
    description: "Built specifically for food businesses — from organic startups to established processing companies.",
  },
];

const steps = [
  { step: "01", title: "Enter Details", desc: "Fill in your product name, ingredients, weight, and key features." },
  { step: "02", title: "Choose Tone", desc: "Pick Premium, Traditional, or Health-Focused to match your brand." },
  { step: "03", title: "Generate", desc: "Click Generate and get a professional description in seconds." },
  { step: "04", title: "Copy & Use", desc: "Copy the description and use it on your website, store, or packaging." },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Everything you need to write better product content
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            NutriWrite AI handles the writing so you can focus on growing your food business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-brand-600 dark:bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-600 dark:bg-brand-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to write better product descriptions?
          </h2>
          <p className="text-brand-100 mb-8">
            Join food businesses that save hours every week with NutriWrite AI.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors"
          >
            Start Generating Free →
          </Link>
        </div>
      </section>
    </>
  );
}
