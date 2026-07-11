"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Enter a GitHub username or profile link.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    router.push(`/explore?user=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            See your projects
            <br />
            the way recruiters do.
          </h1>
          <p className="mt-4 max-w-md text-[var(--text-secondary)]">
            Paste a GitHub profile. Get a portfolio-ready breakdown of every
            public project they have.
          </p>

          <form
            action="/explore"
            method="GET"
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <Input
                name="user"
                placeholder="https://github.com/username or just username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={error}
                aria-label="GitHub username or profile URL"
                autoFocus
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} className="shrink-0">
              Explore repos
            </Button>
          </form>
        </div>
      <Footer />
      </main>
    </div>
  );
}
