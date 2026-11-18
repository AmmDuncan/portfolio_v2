/** Up-right arrow for external links; an SVG because the U+2197 glyph renders as an emoji on iOS Safari. */
export function ArrowUpRight({ size = 14, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="5 5 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none", verticalAlign: "-0.125em" }}
    >
      <path d="M6.5 17.5 17.5 6.5M9 6.5h8.5V15" />
    </svg>
  );
}
