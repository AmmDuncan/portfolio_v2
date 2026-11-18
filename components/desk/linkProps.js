/** Anchor attributes for a link: external http(s) links open in a new tab, mailto, hash and site links do not. */
export function linkProps(href) {
  return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
