"use client";

import Link from "next/link";

export default function ClientPortal() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-5 border-b border-border-light bg-bg-card">
        <h1 className="text-lg font-semibold text-text-primary tracking-tight">
          Welcome to SineLab
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Your AI-powered project partner
        </p>
      </div>

      <div className="px-8 py-6 max-w-2xl">
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Ready to build something?
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-5">
            Our team is ready to help you bring your project to life. Start a
            conversation with our project coordinator — they&apos;ll understand your
            needs, ask the right questions, and put together a plan.
          </p>
          <Link
            href="/client/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition"
          >
            {"\u{1F4AC}"} Start a Conversation
          </Link>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            How it works
          </h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Tell us what you need",
                desc: "Chat with our AI project coordinator. Describe your idea, your users, your domain.",
              },
              {
                step: "2",
                title: "We design and propose",
                desc: "Our Product and Architecture teams create a plan, timeline, and approach for your review.",
              },
              {
                step: "3",
                title: "We build and deliver",
                desc: "8 specialized teams work in coordination — domain experts, engineers, QA — building your project end to end.",
              },
              {
                step: "4",
                title: "You watch it happen",
                desc: "Track progress in real-time. Give feedback. Review deliverables. Everything transparent.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-accent-light text-accent text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {item.title}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
