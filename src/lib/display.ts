export function joinMeta(parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" · ");
}
