export function ApertureSpinner({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="animate-spin"
      style={{ animationDuration: "2.4s" }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <polygon
          key={i}
          points="50,50 68,18 82,28"
          fill="var(--accent)"
          opacity={0.15 + i * 0.14}
          transform={`rotate(${i * 60} 50 50)`}
        />
      ))}
    </svg>
  );
}