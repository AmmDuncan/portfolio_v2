import { Lock } from "./screenStyles";

/** Laptop lock screen for client work that can't be named or shown. */
export function LockScreen({ label, title, intro, stack, scrollerRef }) {
  return (
    <Lock>
      <div className="inner" ref={scrollerRef}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span className="label">{label}</span>
        <h2>{title}</h2>
        <p>{intro}</p>
        <span className="stack">{stack.join(" · ")}</span>
      </div>
    </Lock>
  );
}
