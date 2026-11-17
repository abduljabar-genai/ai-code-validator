"use client";

import React from "react";
import { Sparkles, Settings, Github, HelpCircle, GraduationCap } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export default function Header({ onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
      {/* Top Banner - W3C Inspired */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-400">W3C Inspired</span>
          <span className="text-slate-500">•</span>
          <span>Educational Code Validator for Web Development Students</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
          <span>HTML5 &amp; CSS3 Diagnostic Tool</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">No Code Spoilers</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                CodeValidator<span className="text-blue-600">.ai</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                AI Tutor
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Pinpoints errors with simple explanations and hints — without giving away full code solutions.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              hasApiKey
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 animate-pulse"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>OpenRouter API</span>
            {!hasApiKey && (
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5"></span>
            )}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
