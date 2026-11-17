import { NextRequest, NextResponse } from "next/server";

export interface ValidationIssue {
  id: string;
  severity: "error" | "warning" | "tip";
  category: "syntax" | "standards" | "accessibility" | "semantics" | "obsolete";
  line: number;
  column?: number;
  snippet: string;
  title: string;
  explanation: string;
  hint: string;
  specRef?: string;
}

export interface ValidationResponse {
  isValid: boolean;
  score: number;
  summary: {
    totalErrors: number;
    totalWarnings: number;
    totalTips: number;
    assessment: string;
  };
  issues: ValidationIssue[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      type = "html",
      apiKey: userApiKey,
      model = "google/gemini-2.5-flash",
      strictness = "standard",
    } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "No code provided for validation." },
        { status: 400 }
      );
    }

    const effectiveApiKey =
      userApiKey?.trim() || process.env.OPENROUTER_API_KEY?.trim();

    if (!effectiveApiKey) {
      return NextResponse.json(
        {
          error:
            "OpenRouter API key is missing. Please provide your OpenRouter API key in the Settings modal or set OPENROUTER_API_KEY in your environment variables.",
          isApiKeyMissing: true,
        },
        { status: 401 }
      );
    }

    const systemPrompt = `You are an AI-powered HTML & CSS Validator designed specifically for students learning web development, modeled directly after the W3C CSS Validator and W3C Markup Validation Service.

CRITICAL EDUCATIONAL RULES (STRICTLY ENFORCED):
1. PEDAGOGICAL PHILOSOPHY: Students learn by fixing their own mistakes. NEVER provide full corrected code, replacement blocks, or copy-paste answers. If you give the finished code, the student learns nothing.
2. YOUR ONLY ROLE: Act like a compiler/validator. Detect errors, pinpoint line numbers, explain what is wrong in simple language, and give a hint/guiding question.
3. ERROR DETECTION SCOPE:
   - For HTML: Unclosed tags, mismatched tags, invalid attributes, missing required attributes (e.g. alt on <img>, href on <a>), deprecated tags (<font>, <center>, <marquee>), wrong nesting (e.g. <div> inside <p>, block elements inside inline), doctype issues, unescaped characters.
   - For CSS: Invalid property names, misspelled properties (e.g. 'colour' instead of 'color'), missing units on non-zero dimensions (e.g. 'width: 100'), invalid values/keywords, missing semicolons, unbalanced braces, invalid selectors.
   - For Combined HTML+CSS: Validate both markup and embedded/inline styles.
4. STRICTNESS LEVEL: "${strictness}".
   - "beginner": Focus mainly on syntax breaking errors, basic tag matching, and major misspelled properties.
   - "standard": W3C HTML5 and CSS3 standard compliance + common accessibility (WCAG) + clean nesting.
   - "strict": Rigorous compliance, modern semantic HTML, full WCAG 2.1 AA accessibility, avoidance of obsolete features.

OUTPUT FORMAT:
You MUST respond with valid JSON ONLY. No markdown fences, no explanatory text outside the JSON object.
JSON Schema:
{
  "isValid": boolean,
  "score": number (0 to 100 integer representing code cleanliness),
  "summary": {
    "totalErrors": number,
    "totalWarnings": number,
    "totalTips": number,
    "assessment": "Brief 1-2 sentence overall feedback for the student."
  },
  "issues": [
    {
      "id": "unique string or number",
      "severity": "error" | "warning" | "tip",
      "category": "syntax" | "standards" | "accessibility" | "semantics" | "obsolete",
      "line": number (1-based line number in student's code),
      "column": number (optional approximate column),
      "snippet": "exact snippet of the faulty line/code",
      "title": "Short descriptive title of the issue",
      "explanation": "Simple, beginner-friendly description of WHAT is wrong and WHY it causes an issue according to web standards.",
      "hint": "Pedagogical hint or guiding question to help student find the fix themselves WITHOUT giving away the solution code.",
      "specRef": "W3C / MDN standard reference name, e.g. 'MDN: img element' or 'CSS Spec: background-color'"
    }
  ]
}`;

    const userPrompt = `Validate the following ${type.toUpperCase()} code for a student:

\`\`\`${type}
${code}
\`\`\`

Provide the diagnostic validation JSON according to the schema. Remember: NEVER give the corrected code. Only explain the errors and give guiding hints.`;

    // Call OpenRouter API
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveApiKey}`,
          "HTTP-Referer": "https://ai-code-validator.vercel.app",
          "X-Title": "AI HTML & CSS Validator for Students",
        },
        body: JSON.stringify({
          model: model || "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      let parsedError = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        parsedError = errorJson.error?.message || errorText;
      } catch {
        // use raw errorText
      }

      return NextResponse.json(
        {
          error: `OpenRouter API Error (${openRouterResponse.status}): ${parsedError}`,
        },
        { status: openRouterResponse.status }
      );
    }

    const data = await openRouterResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Received empty response from OpenRouter." },
        { status: 502 }
      );
    }

    // Clean any accidental markdown code fences around JSON
    let cleanJson = content.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    const parsedResult: ValidationResponse = JSON.parse(cleanJson);

    return NextResponse.json(parsedResult);
  } catch (err: unknown) {
    console.error("Validation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Validation service failed: ${message}` },
      { status: 500 }
    );
  }
}
