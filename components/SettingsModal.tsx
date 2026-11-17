"useclient";

import React, { useState, useEffect } from "react";
import { X, Key, Cpu, ShieldCheck, ExternalLink, Check } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const AVAILABLE_MODELS = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google (Fast & Accurate)",
    tag: "Recommended",
  },
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini 1.5 Flash",
    provider: "Google (High Speed)",
    tag: "Fast",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    provider: "Meta (Open Weights)",
    tag: "Smart",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek (Cost-Effective)",
    tag: "Popular",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    tag: "Precise",
  },
];

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  selectedModel,
  onSelectModel,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [model, setModel] = useState(selectedModel);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
    setModel(selectedModel);
  }, [apiKey, selectedModel, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onSelectModel(model);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-300" />
            <h3 className="font-semibold text-lg">OpenRouter AI Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* API Key section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Stored locally in your browser. Never shared or stored on any third-party server.
            </p>
            <div className="mt-2 text-xs text-slate-600">
              Need a key? Get one from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-medium inline-flex items-center hover:underline"
              >
                openrouter.ai/keys <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              AI Validation Model
            </label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition ${
                    model === item.id
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="model-select"
                      value={item.id}
                      checked={model === item.id}
                      onChange={() => setModel(item.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.provider}</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.tag === "Recommended"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/70 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 shadow-sm flex items-center gap-1.5 transition"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Saved!
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
