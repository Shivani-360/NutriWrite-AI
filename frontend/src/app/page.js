import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
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
      <section className="py-20 px-4 bg-paper dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="heading-display text-3xl text-center text-ink dark:text-white mb-4">
              Everything you need to write better product content
            </h2>
            <p className="text-center text-ink-dim dark:text-gray-400 mb-12 max-w-xl mx-auto">
              NutriWrite AI handles the writing so you can focus on growing your food business.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <Card icon={f.icon} title={f.title} description={f.description} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-paper dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="heading-display text-3xl text-center text-ink dark:text-white mb-12">
              How it works
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1} className="text-center">
                <div className="w-12 h-12 bg-brand-600 dark:bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-ink dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-ink-dim dark:text-gray-400">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-600 dark:bg-brand-700">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="heading-display text-3xl text-white mb-4">
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
        </Reveal>
      </section>
    </>
  );
}