"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";
import ValidationResults from "@/components/ValidationResults";
import SettingsModal from "@/components/SettingsModal";
import { ValidationResponse } from "@/app/api/validate/route";
import { AlertCircle, HelpCircle, Shield, CheckCircle2, BookOpen } from "lucide-react";

const BROKEN_HTML_SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <!-- Notice the unclosed title tag -->
  <title>Student Portfolio Page
</head>
<body>
  <h1>Welcome to my Portfolio</h1>

  <div class="container">
    <!-- Notice missing alt attribute on img for accessibility -->
    <img src="profile.jpg">

    <!-- Notice deprecated <center> tag in HTML5 -->
    <center>
      <h2>Full-Stack Learner</h2>
    </center>

    <!-- Notice unclosed paragraph and wrong nesting -->
    <p>I am learning modern web development.
    <div>This block is mistakenly nested inside an unclosed paragraph.</div>

    <ul>
      <li>HTML5 Semantic Tags
      <li>CSS3 Grid & Flexbox
      <li>JavaScript Basics
    <!-- Notice missing closing ul tag -->
  </div>
</body>
</html>`;

const BROKEN_CSS_SAMPLE = `/* Student CSS Stylesheet with Common Syntax Bugs */
body {
  font-family: 'Inter', sans-serif;
  /* Error: 'colour' is British English, standard CSS requires 'color' */
  colour: #222222;
  /* Error: Typo in property name */
  magin: 0;
  padding: 20px;
}

.hero-header {
  width: 100%;
  /* Error: Missing unit (e.g. px or rem) on non-zero number */
  height: 400;
  /* Error: Misspelled background-color and missing semicolon */
  background-colour: #005a9c
  display: flex;
  /* Error: 'centre' is not a valid CSS keyword for justify-content */
  justify-content: centre;
}

.card {
  border-radius: 12px;
  /* Error: Missing closing curly brace */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const BROKEN_COMBINED_SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Sample Webpage</title>
  <style>
    header {
      background-colour: #1e293b; /* misspelled property */
      padding: 20; /* missing unit */
      colour: white;
    }
  </style>
</head>
<body>
  <header>
    <h1>Learning HTML and CSS</h1>
  </header>

  <main>
    <img src="logo.png"> <!-- Missing alt attribute -->
    <font size="3">Deprecated font tag in HTML5</font>
  </main>
</body>
</html>`;

const CLEAN_SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible & Valid HTML5 Page</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 2rem;
      color: #1e293b;
      background-color: #f8fafc;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      padding: 1.5rem;
      border-radius: 0.75rem;
      background-color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Welcome to Clean Web Development</h1>
    <p>This code adheres strictly to modern W3C HTML5 and CSS3 standards.</p>
    <img src="sample.jpg" alt="A high quality landscape illustrating web standards" width="400" height="250">
  </main>
</body>
</html>`;

export default function Home() {
  const [code, setCode] = useState(BROKEN_HTML_SAMPLE);
  const [type, setType] = useState<"html" | "css" | "combined">("html");
  const [strictness, setStrictness] = useState<"beginner" | "standard" | "strict">("standard");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ValidationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("openrouter_api_key");
    if (savedKey) setApiKey(savedKey);

    const savedModel = localStorage.getItem("openrouter_model");
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openrouter_api_key", key);
  };

  const handleSelectModel = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem("openrouter_model", model);
  };

  const handleLoadSample = (sampleType: "broken-html" | "broken-css" | "broken-combined" | "clean") => {
    if (sampleType === "broken-html") {
      setType("html");
      setCode(BROKEN_HTML_SAMPLE);
    } else if (sampleType === "broken-css") {
      setType("css");
      setCode(BROKEN_CSS_SAMPLE);
    } else if (sampleType === "broken-combined") {
      setType("combined");
      setCode(BROKEN_COMBINED_SAMPLE);
    } else if (sampleType === "clean") {
      setType("combined");
      setCode(CLEAN_SAMPLE);
    }
    setResults(null);
    setErrorMessage(null);
    setSelectedLine(null);
  };

  const handleValidate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedLine(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          type,
          strictness,
          apiKey: apiKey.trim(),
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isApiKeyMissing) {
          setIsSettingsOpen(true);
        }
        setErrorMessage(data.error || "Validation failed. Please verify your settings.");
        setIsLoading(false);
        return;
      }

      setResults(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setErrorMessage(`Failed to connect to validation service: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Derive error and warning line numbers to highlight in code editor
  const errorLines = results?.issues
    ?.filter((i) => i.severity === "error")
    ?.map((i) => i.line) || [];

  const warningLines = results?.issues
    ?.filter((i) => i.severity === "warning")
    ?.map((i) => i.line) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* W3C Inspired Educational Philosophy Card */}
        <div className="bg-white rounded-2xl border border-blue-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/50">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm sm:text-base">
                Why doesn't this validator fix your code for you?
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Just like the official <strong>W3C CSS &amp; HTML Validators</strong>, our goal is to help you build real debugging problem-solving intuition. This AI validator identifies syntax violations, explains the rule simply, and gives you guiding hints — so <em>you</em> understand the fix instead of relying on copy-paste shortcuts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs font-semibold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200">
            <Shield className="w-4 h-4 text-blue-700" />
            <span>Anti-Cheating Mode</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 flex items-start gap-3 text-rose-900 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="font-semibold">Notice: </strong>
              {errorMessage}
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs bg-rose-200 hover:bg-rose-300 px-3 py-1 rounded-lg font-medium transition"
            >
              Open Settings
            </button>
          </div>
        )}

        {/* Main Grid: Code Editor on Top, Results Below (or Split) */}
        <div className="grid grid-cols-1 gap-8">
          {/* Section 1: Code Input */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Input HTML or CSS Code
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Direct Input or File Upload
              </span>
            </div>

            <CodeEditor
              code={code}
              onChange={setCode}
              type={type}
              onTypeChange={setType}
              strictness={strictness}
              onStrictnessChange={setStrictness}
              onValidate={handleValidate}
              isLoading={isLoading}
              highlightedLine={selectedLine}
              errorLines={errorLines}
              warningLines={warningLines}
              onLoadSample={handleLoadSample}
            />
          </section>

          {/* Section 2: Validation Results */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  W3C-Style Diagnostic Results
                </h2>
              </div>
              {results && (
                <span className="text-xs text-slate-500">
                  Validated with {selectedModel}
                </span>
              )}
            </div>

            <ValidationResults
              results={results}
              isLoading={isLoading}
              onSelectLine={(line) => setSelectedLine(line)}
              selectedLine={selectedLine}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            AI HTML &amp; CSS Validator • Inspired by W3C Validation Standards • Designed for Students and Educators
          </p>
          <p className="text-slate-400">
            Powered by OpenRouter API • Model: {selectedModel}
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
      />
    </div>
  );
}
