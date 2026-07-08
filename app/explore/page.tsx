// src/app/explore/page.tsx
import { Suspense } from "react";
import { ExploreContent } from "./ExploreContent"

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[var(--text-secondary)]">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}