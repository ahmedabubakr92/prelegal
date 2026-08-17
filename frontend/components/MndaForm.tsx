"use client";

import type { CoverPageData, PartyInfo } from "@/lib/types";

interface MndaFormProps {
  data: CoverPageData;
  onChange: (data: CoverPageData) => void;
}

const inputClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClasses = "block text-sm font-medium text-zinc-700 mb-1";

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={labelClasses}>{label}</span>
      {multiline ? (
        <textarea
          className={inputClasses}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClasses}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function PartyFields({
  title,
  party,
  onChange,
}: {
  title: string;
  party: PartyInfo;
  onChange: (party: PartyInfo) => void;
}) {
  const update = (field: keyof PartyInfo) => (value: string) =>
    onChange({ ...party, [field]: value });

  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-zinc-900">{title}</legend>
      <Field
        label="Legal name"
        value={party.legalName}
        onChange={update("legalName")}
        placeholder="Acme, Inc."
      />
      <Field
        label="Entity type & state of formation"
        value={party.entityType}
        onChange={update("entityType")}
        placeholder="a Delaware corporation"
      />
      <Field
        label="Address"
        value={party.address}
        onChange={update("address")}
        placeholder="123 Main St, San Francisco, CA 94105"
        multiline
      />
      <Field
        label="Signatory name"
        value={party.signatoryName}
        onChange={update("signatoryName")}
        placeholder="Jane Doe"
      />
      <Field
        label="Signatory title"
        value={party.signatoryTitle}
        onChange={update("signatoryTitle")}
        placeholder="CEO"
      />
      <Field
        label="Signatory email"
        value={party.signatoryEmail}
        onChange={update("signatoryEmail")}
        placeholder="jane@acme.com"
        type="email"
      />
    </fieldset>
  );
}

export default function MndaForm({ data, onChange }: MndaFormProps) {
  const update = <K extends keyof CoverPageData>(field: K) => (value: CoverPageData[K]) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-8">
      <PartyFields
        title="Party 1 (Disclosing / Receiving Party)"
        party={data.partyOne}
        onChange={update("partyOne")}
      />
      <PartyFields
        title="Party 2 (Disclosing / Receiving Party)"
        party={data.partyTwo}
        onChange={update("partyTwo")}
      />
      <fieldset className="space-y-3">
        <legend className="text-base font-semibold text-zinc-900">Terms</legend>
        <Field
          label="Effective date"
          value={data.effectiveDate}
          onChange={update("effectiveDate")}
          type="date"
        />
        <Field
          label="Purpose"
          value={data.purpose}
          onChange={update("purpose")}
          placeholder="evaluating a potential business relationship between the parties"
          multiline
        />
        <Field
          label="MNDA term"
          value={data.mndaTerm}
          onChange={update("mndaTerm")}
          placeholder="one (1) year from the Effective Date"
        />
        <Field
          label="Term of confidentiality"
          value={data.termOfConfidentiality}
          onChange={update("termOfConfidentiality")}
          placeholder="three (3) years after the date of disclosure"
        />
        <Field
          label="Governing law (state)"
          value={data.governingLaw}
          onChange={update("governingLaw")}
          placeholder="Delaware"
        />
        <Field
          label="Jurisdiction"
          value={data.jurisdiction}
          onChange={update("jurisdiction")}
          placeholder="San Francisco County, California"
        />
      </fieldset>
    </div>
  );
}
