import type { CoverPageData, CoverPageStringField } from "./types";

const COVERPAGE_LINK_LABELS: Record<string, CoverPageStringField> = {
  Purpose: "purpose",
  "Effective Date": "effectiveDate",
  "MNDA Term": "mndaTerm",
  "Term of Confidentiality": "termOfConfidentiality",
  "Governing Law": "governingLaw",
  Jurisdiction: "jurisdiction",
};

/** Returns the trimmed value, or a placeholder if the field is still empty. */
export function displayValue(value: string, placeholder: string): string {
  return value.trim() || placeholder;
}

/**
 * Prepares a free-text form value for splicing into the middle of a
 * Markdown document: collapses newlines/blank lines (so pasted multi-line
 * text can't split a numbered clause into a new paragraph) and escapes
 * Markdown syntax characters (so the user's literal legal text can't be
 * reinterpreted as bold/italic/strikethrough/links/code by the renderer).
 */
function sanitizeFieldValue(value: string): string {
  const collapsed = value.trim().replace(/\s+/g, " ");
  return collapsed.replace(/[\\`*_[\]~<>]/g, (char) => `\\${char}`);
}

/**
 * Replaces every `<span class="coverpage_link">Label</span>` marker in the
 * Standard Terms markdown with the corresponding form value, falling back to
 * a bracketed placeholder for fields the user hasn't filled in yet.
 */
export function substituteCoverPageFields(
  templateMarkdown: string,
  data: CoverPageData
): string {
  return templateMarkdown.replace(
    /<span class="coverpage_link">([^<]+)<\/span>/g,
    (match, label: string) => {
      const field = COVERPAGE_LINK_LABELS[label.trim()];
      if (!field) return match;
      const value = data[field].trim();
      return value ? sanitizeFieldValue(value) : `[${label.trim()}]`;
    }
  );
}
