"use client";

import { useState, useRef } from "react";

/* ─── Difficulty badge colours ─────────────────────────────────────── */
const BADGE_COLORS = {
  Easy: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  Hard: "bg-rose-100 text-rose-800 border-rose-300",
};

export default function HomePage() {
  const [difficulty, setDifficulty] = useState("");
  const [caseStudy, setCaseStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const documentRef = useRef(null);

  /* ── Generate case study ──────────────────────────────────────────── */
  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setCaseStudy(null);

    try {
      const url = difficulty
        ? `/api/generate?difficulty=${difficulty}`
        : "/api/generate";
      const res = await fetch(url);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate case study");
      }

      const data = await res.json();
      setCaseStudy(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Export to PDF using jsPDF (no html2canvas) ────────────────────
   *  html2canvas cannot parse Tailwind CSS v4's lab()/oklch() color
   *  functions.  Instead of rendering DOM → canvas → PDF, we use
   *  jsPDF's text/shape API directly.  This is 100% reliable.
   * ─────────────────────────────────────────────────────────────────── */
  async function handleExportPDF() {
    if (!caseStudy) return;
    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const PAGE_W = doc.internal.pageSize.getWidth();
      const PAGE_H = doc.internal.pageSize.getHeight();
      const MARGIN = 15;
      const CONTENT_W = PAGE_W - MARGIN * 2;
      let y = 0;

      // ── Helper: auto-paginate ──────────────────────────────────────
      function checkPage(needed = 12) {
        if (y + needed > PAGE_H - MARGIN) {
          doc.addPage();
          y = MARGIN;
        }
      }

      // ── Helper: wrapped text ───────────────────────────────────────
      function addWrappedText(text, x, maxW, fontSize, color, fontStyle = "normal") {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxW);
        const lineH = fontSize * 0.45;
        for (const line of lines) {
          checkPage(lineH + 2);
          doc.text(line, x, y);
          y += lineH;
        }
        y += 2;
      }

      // ── Header bar (blue rectangle) ────────────────────────────────
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(0, 0, PAGE_W, 38, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(191, 219, 254);
      doc.text("DEVOPS TRANSFORMATION CASE STUDY", MARGIN, 14);

      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(caseStudy.companyProfile.companyName, MARGIN, 24);

      const dateStr = new Date(caseStudy.metadata.generatedAt).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );
      doc.setFontSize(9);
      doc.setTextColor(219, 234, 254);
      doc.text(
        `${caseStudy.companyProfile.industry} Sector  ·  Generated ${dateStr}`,
        MARGIN,
        31
      );

      y = 48;

      // ── Section 1: Company Overview ────────────────────────────────
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("01 — COMPANY OVERVIEW", MARGIN, y);
      y += 6;

      addWrappedText(
        `${caseStudy.companyProfile.industry} Industry`,
        MARGIN, CONTENT_W, 13, [15, 23, 42], "bold"
      );
      y += 1;
      addWrappedText(
        caseStudy.companyProfile.description,
        MARGIN, CONTENT_W, 10, [71, 85, 105]
      );

      // Divider
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 8;

      // ── Section 2: Architecture ────────────────────────────────────
      checkPage(30);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("02 — CURRENT TECHNICAL ARCHITECTURE", MARGIN, y);
      y += 6;

      addWrappedText(
        caseStudy.currentArchitecture.name,
        MARGIN, CONTENT_W, 13, [15, 23, 42], "bold"
      );
      y += 1;
      addWrappedText(
        caseStudy.currentArchitecture.description,
        MARGIN, CONTENT_W, 10, [71, 85, 105]
      );

      // Divider
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 8;

      // ── Section 3: Pain Points ─────────────────────────────────────
      checkPage(20);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("03 — TRANSFORMATION CHALLENGES", MARGIN, y);
      y += 8;

      const BADGE_PDF = {
        Easy: { bg: [209, 250, 229], text: [6, 95, 70] },
        Medium: { bg: [254, 243, 199], text: [146, 64, 14] },
        Hard: { bg: [255, 228, 230], text: [159, 18, 57] },
      };

      caseStudy.problems.forEach((problem, idx) => {
        checkPage(30);

        // Number circle
        doc.setFillColor(219, 234, 254);
        doc.circle(MARGIN + 4, y - 1.5, 4, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(29, 78, 216);
        doc.text(String(idx + 1), MARGIN + 2.8, y);

        // Badge
        const badge = BADGE_PDF[problem.difficultyLevel] || BADGE_PDF.Easy;
        const badgeText = problem.difficultyLevel;
        const badgeX = MARGIN + 12;
        doc.setFillColor(...badge.bg);
        doc.roundedRect(badgeX, y - 4, 18, 5, 2, 2, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...badge.text);
        doc.text(badgeText, badgeX + 2, y - 0.5);

        y += 4;

        // Description
        addWrappedText(
          problem.description,
          MARGIN + 12, CONTENT_W - 12, 9.5, [51, 65, 85]
        );
        y += 4;
      });

      // Divider
      y += 1;
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 8;

      // ── Section 4: Assignment ──────────────────────────────────────
      checkPage(30);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("04 — YOUR ASSIGNMENT", MARGIN, y);
      y += 6;

      // Light blue background box
      doc.setFillColor(239, 246, 255);
      const assignLines = doc.splitTextToSize(caseStudy.challenge, CONTENT_W - 10);
      const boxH = assignLines.length * 4.2 + 10;
      checkPage(boxH + 4);
      doc.roundedRect(MARGIN, y - 3, CONTENT_W, boxH, 2, 2, "F");

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      doc.text(assignLines, MARGIN + 5, y + 3);
      y += boxH + 6;

      // ── Footer ─────────────────────────────────────────────────────
      checkPage(10);
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 5;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`Difficulty filter: ${caseStudy.metadata.difficultyFilter}`, MARGIN, y);
      doc.text(
        `Pain points: ${caseStudy.metadata.painPointCount}`,
        PAGE_W - MARGIN,
        y,
        { align: "right" }
      );

      // Save with explicit Blob + anchor to guarantee .pdf filename
      const safeName = caseStudy.companyProfile.companyName.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `CaseStudy_${safeName}_${Date.now()}.pdf`;
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      setError("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              DevOps Case Study Generator
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Generate randomized transformation scenarios for DevOps training
            </p>
          </div>
          <a
            href="/admin"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Admin Dashboard →
          </a>
        </div>
      </header>

      {/* ── Controls ────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-end gap-4 mb-8">
          {/* Difficulty dropdown */}
          <div className="flex flex-col">
            <label
              htmlFor="difficulty"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer min-w-[170px]"
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating…
              </>
            ) : (
              "Generate Case Study"
            )}
          </button>

          {/* PDF Export button — only visible when case study exists */}
          {caseStudy && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="h-11 px-5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
            >
              {isExporting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Exporting…
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download as PDF
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Error state ──────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            ⚠ {error}
          </div>
        )}

        {/* ── Loading skeleton ─────────────────────────────────────── */}
        {isLoading && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-10 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-2/3 mb-6" />
            <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-5/6 mb-8" />
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-4/5 mb-8" />
            <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {!isLoading && !caseStudy && !error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <svg
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-1">
              No case study generated yet
            </h2>
            <p className="text-sm text-slate-500">
              Select a difficulty level and click{" "}
              <span className="font-medium text-blue-600">
                Generate Case Study
              </span>{" "}
              to begin.
            </p>
          </div>
        )}

        {/* ── Case Study Document ──────────────────────────────────── */}
        {caseStudy && !isLoading && (
          <div
            id="case-study-document"
            ref={documentRef}
            className="pdf-document bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Document header bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                DevOps Transformation Case Study
              </p>
              <h2 className="text-2xl font-bold text-white">
                {caseStudy.companyProfile.companyName}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {caseStudy.companyProfile.industry} Sector&ensp;·&ensp;Generated{" "}
                {new Date(caseStudy.metadata.generatedAt).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </p>
            </div>

            <div className="px-8 py-8 space-y-8">
              {/* ── Section 1: Company Overview ─────────────────────── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  01 — Company Overview
                </h3>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {caseStudy.companyProfile.industry} Industry
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {caseStudy.companyProfile.description}
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* ── Section 2: Current Architecture ─────────────────── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  02 — Current Technical Architecture
                </h3>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {caseStudy.currentArchitecture.name}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {caseStudy.currentArchitecture.description}
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* ── Section 3: Problems / Pain Points ───────────────── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                  03 — Transformation Challenges
                </h3>
                <div className="space-y-4">
                  {caseStudy.problems.map((problem, index) => (
                    <div
                      key={problem.id}
                      className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_COLORS[problem.difficultyLevel] ||
                              "bg-slate-100 text-slate-600 border-slate-300"
                              }`}
                          >
                            {problem.difficultyLevel}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* ── Section 4: The Challenge ────────────────────────── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  04 — Your Assignment
                </h3>
                <div className="p-5 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-slate-800 leading-relaxed text-sm">
                    {caseStudy.challenge}
                  </p>
                </div>
              </section>

              {/* ── Footer metadata ────────────────────────────────── */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Difficulty filter:{" "}
                  <span className="font-medium text-slate-500">
                    {caseStudy.metadata.difficultyFilter}
                  </span>
                </span>
                <span>
                  Pain points:{" "}
                  <span className="font-medium text-slate-500">
                    {caseStudy.metadata.painPointCount}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="max-w-5xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
        DevOps Case Study Generator · Ayan Khan · CSE3253 DevOps [PE6] ·
        Semester VI (2025–2026)
      </footer>
    </div>
  );
}
