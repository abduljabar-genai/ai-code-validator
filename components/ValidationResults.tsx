"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  GraduationCap,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { ValidationResponse, ValidationIssue } from "@/app/api/validate/route";

interface ValidationResultsProps {
  results: ValidationResponse | null;
  isLoading: boolean;
  onSelectLine: (line: number) => void;
  selectedLine: number | null;
}

export default function ValidationResults({
  results,
  isLoading,
  onSelectLine,
  selectedLine,
}: ValidationResultsProps) {
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "tip">("all");
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            AI Pedagogical Validator is Inspecting Your Code...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mt-1">
            Checking W3C syntax standards, tag pairing, CSS property validity, and accessibility rules without giving away full code solutions.
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            No Validation Run Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Paste your HTML or CSS code above and click <strong>Validate Code with AI</strong> to get a line-by-line pedagogical diagnosis.
          </p>
        </div>
      </div>
    );
  }

  const { isValid, score, summary, issues } = results;

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true;
    return issue.severity === filter;
  });

  const handleCopyReport = () => {
    const report = `# AI Code Validation Report (W3C-Style)
Status: ${isValid ? "PASS" : "FAIL"} (Score: ${score}/100)
Summary: ${summary.totalErrors} Errors, ${summary.totalWarnings} Warnings, ${summary.totalTips} Educational Tips
Assessment: ${summary.assessment}

## Issues Diagnosed:
${issues
  .map(
    (item, idx) =>
      `### ${idx + 1}. [${item.severity.toUpperCase()}] Line ${item.line}: ${item.title}
- Snippet: \`${item.snippet}\`
- Explanation: ${item.explanation}
- Pedagogical Hint: ${item.hint}
${item.specRef ? `- Reference: ${item.specRef}` : ""}`
  )
  .join("\n\n")}
`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Primary Result Banner (W3C-Style Banner) */}
      <div
        className={`rounded-2xl p-6 border shadow-sm transition ${
          isValid && summary.totalErrors === 0
            ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 text-emerald-950"
            : "bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-rose-300 text-slate-900"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isValid && summary.totalErrors === 0
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              }`}
            >
              {isValid && summary.totalErrors === 0 ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertOctagon className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">
                  {isValid && summary.totalErrors === 0
                    ? "Congratulations! Code Passed Validation"
                    : `Validation Detected ${summary.totalErrors} Error${
                        summary.totalErrors === 1 ? "" : "s"
                      }`}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    isValid && summary.totalErrors === 0
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-rose-100 text-rose-800 border-rose-300"
                  }`}
                >
                  {isValid && summary.totalErrors === 0
                    ? "Valid Standards"
                    : "Corrections Needed"}
                </span>
              </div>
              <p className="text-sm mt-1 text-slate-700 leading-relaxed">
                {summary.assessment}
              </p>
            </div>
          </div>

          {/* Cleanliness / Quality Score Gauge */}
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 shrink-0 self-start md:self-auto">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">
                {score}
                <span className="text-xs font-medium text-slate-500">/100</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Code Health
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <span className="block font-bold text-rose-600">
                  {summary.totalErrors}
                </span>
                <span className="text-[10px] text-slate-500">Errors</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-amber-600">
                  {summary.totalWarnings}
                </span>
                <span className="text-[10px] text-slate-500">Warnings</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-blue-600">
                  {summary.totalTips}
                </span>
                <span className="text-[10px] text-slate-500">Tips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Safety Callout */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-medium text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-md">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>
              <strong>Student-First Learning:</strong> Full code answers are purposefully withheld so you can practice real debugging skills.
            </span>
          </div>

          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-2xs font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Report Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Homework Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {issues.length > 0 && (
        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-1">
            <span className="px-2 font-medium text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "error"
                  ? "bg-rose-600 text-white"
                  : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              Errors ({summary.totalErrors})
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "warning"
                  ? "bg-amber-500 text-white"
                  : "text-amber-800 hover:bg-amber-50"
              }`}
            >
              Warnings ({summary.totalWarnings})
            </button>
            <button
              onClick={() => setFilter("tip")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "tip"
                  ? "bg-blue-600 text-white"
                  : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              Tips ({summary.totalTips})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline pr-2">
            Click any issue to highlight the corresponding line
          </span>
        </div>
      )}

      {/* Issue Cards */}
      <div className="space-y-3">
        {filteredIssues.map((issue, index) => {
          const isSelected = selectedLine === issue.line;
          const isError = issue.severity === "error";
          const isWarning = issue.severity === "warning";

          return (
            <div
              key={issue.id || index}
              onClick={() => onSelectLine(issue.line)}
              className={`rounded-2xl border p-5 bg-white transition cursor-pointer hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/20"
                  : isError
                  ? "border-rose-200 hover:border-rose-300"
                  : isWarning
                  ? "border-amber-200 hover:border-amber-300"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isError
                        ? "bg-rose-100 text-rose-700"
                        : isWarning
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isError ? (
                      <AlertOctagon className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Lightbulb className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md ${
                          isError
                            ? "bg-rose-600 text-white"
                            : isWarning
                            ? "bg-amber-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>

                      <span className="bg-slate-100 text-slate-700 font-mono font-medium px-2 py-0.5 rounded-md">
                        Line {issue.line}
                        {issue.column ? `, Col ${issue.column}` : ""}
                      </span>

                      {issue.category && (
                        <span className="bg-slate-100 text-slate-600 capitalize px-2 py-0.5 rounded-md text-[11px]">
                          {issue.category}
                        </span>
                      )}

                      {issue.specRef && (
                        <span className="text-slate-400 text-[11px]">
                          Ref: {issue.specRef}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 text-base mt-2">
                      {issue.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-blue-600 font-medium flex items-center gap-0.5 shrink-0 hover:underline">
                  <span>View Line {issue.line}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Code Snippet Box */}
              {issue.snippet && (
                <div className="mt-3 bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs overflow-x-auto border border-slate-800">
                  <span className="text-slate-500 select-none mr-2">
                    L{issue.line}:
                  </span>
                  <span className={isError ? "text-rose-300 font-medium" : "text-amber-200"}>
                    {issue.snippet}
                  </span>
                </div>
              )}

              {/* Simple Description (What's wrong & why) */}
              <div className="mt-3.5 space-y-2">
                <div className="bg-slate-50 rounded-xl p-3 text-xs leading-relaxed text-slate-700 border border-slate-100">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    What is the issue?
                  </div>
                  <p>{issue.explanation}</p>
                </div>

                {/* Pedagogical Hint (Guiding hint without doing the work) */}
                <div className="bg-amber-50/70 rounded-xl p-3 text-xs leading-relaxed text-amber-950 border border-amber-200/70">
                  <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    How to think about fixing it:
                  </div>
                  <p>{issue.hint}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No issues match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
