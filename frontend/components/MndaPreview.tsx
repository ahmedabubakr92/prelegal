"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { displayValue as display, substituteCoverPageFields } from "@/lib/template";
import type { CoverPageData, PartyInfo } from "@/lib/types";

interface MndaPreviewProps {
  data: CoverPageData;
  templateMarkdown: string;
}

function PartySummary({ title, party }: { title: string; party: PartyInfo }) {
  return (
    <div>
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1">
        {display(party.legalName, "[Legal Name]")},{" "}
        {display(party.entityType, "[Entity Type & State of Formation]")}
      </p>
      <p className="whitespace-pre-line text-zinc-600">
        {display(party.address, "[Address]")}
      </p>
      <p className="mt-2 text-zinc-600">
        Signatory: {display(party.signatoryName, "[Signatory Name]")},{" "}
        {display(party.signatoryTitle, "[Signatory Title]")}
        <br />
        {display(party.signatoryEmail, "[Signatory Email]")}
      </p>
    </div>
  );
}

export default function MndaPreview({ data, templateMarkdown }: MndaPreviewProps) {
  const standardTerms = substituteCoverPageFields(templateMarkdown, data);

  return (
    <article className="prose prose-zinc max-w-none rounded-lg border border-zinc-200 bg-white p-8 text-sm">
      <h1 className="!mb-6 text-2xl font-bold text-zinc-900">
        Mutual Non-Disclosure Agreement
      </h1>

      <section className="not-prose grid grid-cols-1 gap-6 rounded-md bg-zinc-50 p-4 text-sm sm:grid-cols-2">
        <PartySummary title="Party 1" party={data.partyOne} />
        <PartySummary title="Party 2" party={data.partyTwo} />
        <div>
          <h3 className="font-semibold text-zinc-900">Effective Date</h3>
          <p className="text-zinc-600">{display(data.effectiveDate, "[Effective Date]")}</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">Purpose</h3>
          <p className="text-zinc-600">{display(data.purpose, "[Purpose]")}</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">MNDA Term</h3>
          <p className="text-zinc-600">{display(data.mndaTerm, "[MNDA Term]")}</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">Term of Confidentiality</h3>
          <p className="text-zinc-600">
            {display(data.termOfConfidentiality, "[Term of Confidentiality]")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">Governing Law</h3>
          <p className="text-zinc-600">{display(data.governingLaw, "[Governing Law]")}</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">Jurisdiction</h3>
          <p className="text-zinc-600">{display(data.jurisdiction, "[Jurisdiction]")}</p>
        </div>
      </section>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>{standardTerms}</ReactMarkdown>
    </article>
  );
}
