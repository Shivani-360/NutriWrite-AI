import Card from "@/components/Card";
import Link from "next/link";

export const metadata = {
  title: "About – NutriWrite AI",
};

const techStack = [
  { icon: "⚛️", title: "Next.js + React", description: "Modern frontend framework for fast, SEO-friendly pages." },
  { icon: "🎨", title: "Tailwind CSS", description: "Utility-first CSS for clean, responsive design with dark mode." },
  { icon: "🟢", title: "Node.js + Express", description: "Lightweight, fast REST API backend to handle requests." },
  { icon: "🤖", title: "Google Gemini AI", description: "State-of-the-art AI model for natural language generation." },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-5xl block mb-4">🥗</span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About NutriWrite AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          An AI-powered tool built specifically to help food businesses create
          professional, engaging product descriptions — without needing a copywriter.
        </p>
      </div>

      {/* Problem */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          🎯 The Problem We Solve
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Food businesses — from home-based sellers to large processing companies —
          spend hours writing product descriptions manually. Many lack dedicated content
          teams. The result? Generic, inconsistent, or missing descriptions that hurt
          sales and brand credibility. NutriWrite AI solves this by generating
          professional descriptions in seconds from just a few product details.
        </p>
      </div>

      {/* Tech Stack */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🛠️ Tech Stack
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {techStack.map((t) => (
          <Card key={t.title} icon={t.icon} title={t.title} description={t.description} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/generate" className="btn-primary text-base px-8 py-4">
          Try NutriWrite AI Free →
        </Link>
      </div>
    </div>
  );
}
