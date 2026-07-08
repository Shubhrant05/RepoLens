export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <polygon
          key={i}
          points="50,50 68,18 82,28"
          fill="var(--accent)"
          opacity={0.35 + i * 0.11}
          transform={`rotate(${i * 60} 50 50)`}
        />
      ))}
    </svg>
  );
}