import { Mail, Coffee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="font-display mt-6 text-3xl font-semibold text-[var(--text-primary)]">
          About RepoLens
        </h1>

        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          I got tired of opening GitHub repos, reading three README files, and
          still having no idea what the project actually did. So I built
          RepoLens. Drop in any public GitHub profile and it turns repositories
          into quick, AI-powered breakdowns—explaining the architecture, tech
          stack, and what each project is really about. Perfect for stalking
          cool developers, polishing your own portfolio, or finally
          understanding that one repo with 20,000 stars. Because code should
          speak for itself... but sometimes it mumbles.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:devshubh1803@gmail.com?subject=RepoLens%20feedback"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--border)]"
          >
            <Mail size={16} />
            Share feedback
          </a>
          <a
            href="https://buymeachai.ezee.li/devshubh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-2 py-1 hover:bg-[var(--border)] transition-colors"
          >
            <img
              src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
              alt="Buy Me A Chai"
              width="160"
            />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
