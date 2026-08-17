export interface PartyInfo {
  legalName: string;
  entityType: string;
  address: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
}

export interface CoverPageData {
  partyOne: PartyInfo;
  partyTwo: PartyInfo;
  effectiveDate: string;
  purpose: string;
  mndaTerm: string;
  termOfConfidentiality: string;
  governingLaw: string;
  jurisdiction: string;
}

export const EMPTY_PARTY_INFO: PartyInfo = {
  legalName: "",
  entityType: "",
  address: "",
  signatoryName: "",
  signatoryTitle: "",
  signatoryEmail: "",
};

export const EMPTY_COVER_PAGE_DATA: CoverPageData = {
  partyOne: { ...EMPTY_PARTY_INFO },
  partyTwo: { ...EMPTY_PARTY_INFO },
  effectiveDate: "",
  purpose: "",
  mndaTerm: "",
  termOfConfidentiality: "",
  governingLaw: "",
  jurisdiction: "",
};

export type CoverPageStringField = Exclude<keyof CoverPageData, "partyOne" | "partyTwo">;

const REQUIRED_PARTY_FIELDS: (keyof PartyInfo)[] = [
  "legalName",
  "entityType",
  "address",
  "signatoryName",
  "signatoryTitle",
  "signatoryEmail",
];

const REQUIRED_TOP_LEVEL_FIELDS: CoverPageStringField[] = [
  "effectiveDate",
  "purpose",
  "mndaTerm",
  "termOfConfidentiality",
  "governingLaw",
  "jurisdiction",
];

export function isCoverPageDataComplete(data: CoverPageData): boolean {
  const partyComplete = (party: PartyInfo) =>
    REQUIRED_PARTY_FIELDS.every((field) => party[field].trim() !== "");

  return (
    partyComplete(data.partyOne) &&
    partyComplete(data.partyTwo) &&
    REQUIRED_TOP_LEVEL_FIELDS.every((field) => data[field].trim() !== "")
  );
}
