export type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; value: string; href: string };

// A backslash-escaped syntax character (e.g. `\*`) is matched first and
// unescaped to its literal character, so escaped user text (see
// lib/template.ts's sanitizeFieldValue) can't be reinterpreted as bold or
// link syntax here, matching how react-markdown/remark already treat
// CommonMark backslash escapes in the on-screen preview.
const INLINE_PATTERN =
  /\\([\\`*_[\]~<>])|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/** Parses a line of markdown for `**bold**` spans and `[text](url)` links. */
export function parseInlineMarkdown(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: "text", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "bold", value: match[2] });
    } else {
      tokens.push({ type: "link", value: match[3], href: match[4] });
    }
    lastIndex = INLINE_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

export interface MarkdownBlock {
  type: "heading" | "paragraph";
  text: string;
}

/** Splits markdown into blank-line-separated blocks (headings vs. paragraphs). */
export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block.startsWith("# ")
        ? { type: "heading" as const, text: block.slice(2).trim() }
        : { type: "paragraph" as const, text: block }
    );
}
