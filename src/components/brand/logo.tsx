export function DaakMark({ className = "size-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="7" y="16" width="50" height="34" rx="4" fill="#fff" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M9 18.5 32 36.5 55 18.5" fill="none" stroke="#C8102E" strokeWidth="2" />
      <circle cx="46" cy="42" r="11" fill="#C8102E" />
      <text x="46" y="45.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif, system-ui">
        NP
      </text>
    </svg>
  );
}
