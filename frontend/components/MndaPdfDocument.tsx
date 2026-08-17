import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { parseInlineMarkdown, parseMarkdownBlocks } from "@/lib/inline-markdown";
import { displayValue as display, substituteCoverPageFields } from "@/lib/template";
import type { CoverPageData, PartyInfo } from "@/lib/types";

const styles = StyleSheet.create({
  page: { paddingVertical: 48, paddingHorizontal: 56, fontSize: 10, lineHeight: 1.5 },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  heading: { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 8 },
  paragraph: { marginBottom: 8, textAlign: "justify" },
  bold: { fontWeight: 700 },
  link: { color: "#1d4ed8" },
  coverPage: { marginBottom: 16, padding: 12, backgroundColor: "#f4f4f5" },
  coverRow: { flexDirection: "row", marginBottom: 8 },
  coverColumn: { flex: 1, paddingRight: 8 },
  coverLabel: { fontWeight: 700, marginBottom: 2 },
  coverValue: { color: "#3f3f46" },
});

function PartySummary({ title, party }: { title: string; party: PartyInfo }) {
  return (
    <View style={styles.coverColumn}>
      <Text style={styles.coverLabel}>{title}</Text>
      <Text style={styles.coverValue}>
        {display(party.legalName, "[Legal Name]")}, {display(party.entityType, "[Entity Type & State of Formation]")}
      </Text>
      <Text style={styles.coverValue}>{display(party.address, "[Address]")}</Text>
      <Text style={styles.coverValue}>
        Signatory: {display(party.signatoryName, "[Signatory Name]")}, {display(party.signatoryTitle, "[Signatory Title]")}
      </Text>
      <Text style={styles.coverValue}>{display(party.signatoryEmail, "[Signatory Email]")}</Text>
    </View>
  );
}

function CoverField({ label, value, placeholder }: { label: string; value: string; placeholder: string }) {
  return (
    <View style={styles.coverColumn}>
      <Text style={styles.coverLabel}>{label}</Text>
      <Text style={styles.coverValue}>{display(value, placeholder)}</Text>
    </View>
  );
}

function InlineText({ text }: { text: string }) {
  return (
    <Text>
      {parseInlineMarkdown(text).map((token, index) => {
        if (token.type === "bold") {
          return (
            <Text key={index} style={styles.bold}>
              {token.value}
            </Text>
          );
        }
        if (token.type === "link") {
          return (
            <Link key={index} src={token.href} style={styles.link}>
              {token.value}
            </Link>
          );
        }
        return <Text key={index}>{token.value}</Text>;
      })}
    </Text>
  );
}

interface MndaPdfDocumentProps {
  data: CoverPageData;
  templateMarkdown: string;
}

export default function MndaPdfDocument({ data, templateMarkdown }: MndaPdfDocumentProps) {
  const standardTerms = substituteCoverPageFields(templateMarkdown, data);
  const blocks = parseMarkdownBlocks(standardTerms);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>

        <View style={styles.coverPage}>
          <View style={styles.coverRow}>
            <PartySummary title="Party 1" party={data.partyOne} />
            <PartySummary title="Party 2" party={data.partyTwo} />
          </View>
          <View style={styles.coverRow}>
            <CoverField label="Effective Date" value={data.effectiveDate} placeholder="[Effective Date]" />
            <CoverField label="Purpose" value={data.purpose} placeholder="[Purpose]" />
          </View>
          <View style={styles.coverRow}>
            <CoverField label="MNDA Term" value={data.mndaTerm} placeholder="[MNDA Term]" />
            <CoverField
              label="Term of Confidentiality"
              value={data.termOfConfidentiality}
              placeholder="[Term of Confidentiality]"
            />
          </View>
          <View style={styles.coverRow}>
            <CoverField label="Governing Law" value={data.governingLaw} placeholder="[Governing Law]" />
            <CoverField label="Jurisdiction" value={data.jurisdiction} placeholder="[Jurisdiction]" />
          </View>
        </View>

        {blocks.map((block, index) =>
          block.type === "heading" ? (
            <Text key={index} style={styles.heading}>
              {block.text}
            </Text>
          ) : (
            <View key={index} style={styles.paragraph}>
              <InlineText text={block.text} />
            </View>
          )
        )}
      </Page>
    </Document>
  );
}
