# 🎓 AI HTML & CSS Validator for Students (W3C-Inspired)

An educational, AI-powered diagnostic validator for HTML and CSS inspired by the official **[W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/validator)** and **W3C Markup Validation Service**.

---

## 💡 Pedagogical Philosophy & Core Rule

When students use AI to solve their code, they often copy-paste the finished result without understanding why their original code failed.

**This validator enforces strict educational guardrails:**
- ✅ **Pinpoints Errors**: Exact line numbers, columns, and code snippets.
- ✅ **Simple Plain-Language Descriptions**: Explains *what* is wrong and *why* standard web specifications (W3C HTML5 & CSS3) require it.
- ✅ **Guiding Pedagogical Hints**: Gives guiding questions and conceptual clues so students learn to debug.
- 🛑 **NO Code Spoilers**: **NEVER** rewrites the full code or provides complete solutions. The student does the real thinking and learning!

---

## 🚀 Features

- **Direct Input & File Upload**: Validate HTML, CSS, or combined full-document webpages.
- **W3C-Style Status Banners**: Instant pass/fail status, health score (0-100), and breakdown by Errors, Warnings, and Educational Tips.
- **Interactive Code Editor**:
  - Synchronized line numbers.
  - Highlights lines containing errors and warnings.
  - Clicking any issue card highlights that exact line in the editor.
- **Built-in Sample Presets**:
  - Buggy HTML (unclosed tags, missing `alt`, deprecated `<center>`).
  - Buggy CSS (misspelled `colour`, missing units, unclosed braces).
  - Clean Valid Code (demonstrating compliant HTML5 + CSS3).
- **Flexible AI Integration**:
  - Powered by **OpenRouter API** (`google/gemini-2.5-flash`, `meta-llama/llama-3.3-70b-instruct`, `deepseek/deepseek-chat`, etc.).
  - Bring-Your-Own-Key GUI (saved safely in browser `localStorage`) or server-side `OPENROUTER_API_KEY` environment variable.
- **Homework Report Export**: One-click copy formatted Markdown report for student assignment submissions.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Gateway**: OpenRouter API
- **Deployment**: Vercel ready

---

## ⚡ Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abduljabar-genai/ai-code-validator.git
   cd ai-code-validator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure OpenRouter API Key (Optional)**:
   Create a `.env.local` file:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   *(Alternatively, enter your key in the web app's Settings modal).*

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

### Option 1: One-Click Vercel Import
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the `abduljabar-genai/ai-code-validator` repository.
3. Add the Environment Variable `OPENROUTER_API_KEY` (optional, as users can also provide their key in the app GUI).
4. Click **Deploy**!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 📜 License
MIT License. Created for web development students, instructors, and bootcamps.
