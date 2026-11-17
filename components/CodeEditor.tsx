"use client";

import React, { useRef, useEffect } from "react";
import {
  FileCode,
  Palette,
  Layers,
  Upload,
  Trash2,
  Clipboard,
  Play,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  type: "html" | "css" | "combined";
  onTypeChange: (type: "html" | "css" | "combined") => void;
  strictness: "beginner" | "standard" | "strict";
  onStrictnessChange: (val: "beginner" | "standard" | "strict") => void;
  onValidate: () => void;
  isLoading: boolean;
  highlightedLine: number | null;
  errorLines: number[];
  warningLines: number[];
  onLoadSample: (sampleType: "broken-html" | "broken-css" | "broken-combined" | "clean") => void;
}

export default function CodeEditor({
  code,
  onChange,
  type,
  onTypeChange,
  strictness,
  onStrictnessChange,
  onValidate,
  isLoading,
  highlightedLine,
  errorLines,
  warningLines,
  onLoadSample,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 18);

  // Sync line numbers scrolling with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
        if (file.name.endsWith(".css")) {
          onTypeChange("css");
        } else if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
          onTypeChange("html");
        }
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = "";
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Bar: Tabs & Controls */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Document Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => onTypeChange("html")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              type === "html"
                ? "bg-white text-blue-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode className="w-4 h-4 text-orange-500" />
            <span>HTML Document</span>
          </button>
          <button
            onClick={() => onTypeChange("css")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              type === "css"
                ? "bg-white text-blue-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Palette className="w-4 h-4 text-blue-500" />
            <span>CSS Stylesheet</span>
          </button>
          <button
            onClick={() => onTypeChange("combined")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              type === "combined"
                ? "bg-white text-blue-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>HTML + CSS Combined</span>
          </button>
        </div>

        {/* Strictness Level Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 hidden sm:inline">
            Pedagogical Mode:
          </label>
          <select
            value={strictness}
            onChange={(e) =>
              onStrictnessChange(
                e.target.value as "beginner" | "standard" | "strict"
              )
            }
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="beginner">Beginner (Syntax &amp; Structure)</option>
            <option value="standard">Standard (W3C HTML5/CSS3)</option>
            <option value="strict">Strict (WCAG Accessibility &amp; Semantics)</option>
          </select>
        </div>
      </div>

      {/* Secondary Bar: Sample code loaders & Editor actions */}
      <div className="bg-slate-100/50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-medium mr-1">Load Sample:</span>
          <button
            onClick={() => onLoadSample("broken-html")}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Buggy HTML
          </button>
          <button
            onClick={() => onLoadSample("broken-css")}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Buggy CSS
          </button>
          <button
            onClick={() => onLoadSample("broken-combined")}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Full Page with Bugs
          </button>
          <button
            onClick={() => onLoadSample("clean")}
            className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition"
          >
            Clean Valid Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".html,.htm,.css,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
            title="Upload file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          <button
            onClick={() => onChange("")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Clear editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex min-h-[380px] max-h-[520px] bg-white font-mono text-xs sm:text-sm">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="select-none py-3 px-2 bg-slate-50 border-r border-slate-200 text-slate-400 text-right overflow-hidden w-14 shrink-0 font-mono text-xs leading-6"
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isError = errorLines.includes(lineNum);
            const isWarning = warningLines.includes(lineNum);
            const isHighlighted = highlightedLine === lineNum;

            return (
              <div
                key={lineNum}
                className={`h-6 flex items-center justify-end px-1 rounded transition ${
                  isHighlighted
                    ? "bg-blue-600 text-white font-bold"
                    : isError
                    ? "bg-rose-100 text-rose-700 font-semibold"
                    : isWarning
                    ? "bg-amber-100 text-amber-800 font-semibold"
                    : ""
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder={
              type === "html"
                ? `<!-- Enter your HTML code here to validate -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My Web Page</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n</body>\n</html>`
                : type === "css"
                ? `/* Enter your CSS styles here to validate */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  color: #333;\n}`
                : `<!-- Enter full webpage (HTML with <style> or inline CSS) -->`
            }
            spellCheck={false}
            className="w-full h-full min-h-[380px] max-h-[520px] p-3 text-slate-800 leading-6 bg-transparent resize-none focus:outline-none overflow-auto font-mono selection:bg-blue-200"
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{code.length} characters</span>
          {errorLines.length > 0 && (
            <>
              <span>•</span>
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorLines.length} line(s) flagged
              </span>
            </>
          )}
        </div>

        <button
          onClick={onValidate}
          disabled={isLoading || !code.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-700/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Analyzing &amp; Validating...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Validate Code with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
