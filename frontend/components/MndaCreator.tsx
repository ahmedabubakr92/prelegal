"use client";

import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

import MndaForm from "@/components/MndaForm";
import MndaPdfDocument from "@/components/MndaPdfDocument";
import MndaPreview from "@/components/MndaPreview";
import { EMPTY_COVER_PAGE_DATA, isCoverPageDataComplete, type CoverPageData } from "@/lib/types";

interface MndaCreatorProps {
  templateMarkdown: string;
}

export default function MndaCreator({ templateMarkdown }: MndaCreatorProps) {
  const [data, setData] = useState<CoverPageData>(EMPTY_COVER_PAGE_DATA);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isComplete = isCoverPageDataComplete(data);

  async function handleDownload() {
    setIsGeneratingPdf(true);
    setDownloadError(null);
    try {
      const blob = await pdf(
        <MndaPdfDocument data={data} templateMarkdown={templateMarkdown} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mutual-nda.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate MNDA PDF:", error);
      setDownloadError("Couldn't generate the PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">Mutual NDA Creator</h1>
        </div>
        <MndaForm data={data} onChange={setData} />
      </div>

      <div>
        <div className="sticky top-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-500">Preview</h2>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!isComplete || isGeneratingPdf}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              title={isComplete ? undefined : "Fill in all fields to enable download"}
            >
              {isGeneratingPdf ? "Preparing PDF…" : "Download PDF"}
            </button>
          </div>
          {downloadError && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {downloadError}
            </p>
          )}
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            <MndaPreview data={data} templateMarkdown={templateMarkdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
