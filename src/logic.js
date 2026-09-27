// QVAC Portfolio Project Description Writer — core logic.
// Given what a project does and what tech was used, writes a portfolio-style
// description. Every tech item the user listed is guaranteed to appear in
// the final output — enforced deterministically, not left to the model,
// since small models can silently drop one item from a list (bug pattern).

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length < 3) return true;
  if (text.length > 900) return true;
  const bad = [
    "i cannot", "i can't", "as an ai", "i'm not able", "i do not have",
    "i'm sorry", "i am sorry", "please provide more", "please try again",
    "i'd be happy to help", "could you provide", "can you provide",
  ];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripWrapping(text) {
  return text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .replace(/^description:\s*/i, "")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
}

function splitTech(techList) {
  return techList
    .split(/,|\band\b|\n/i)
    .map((t) => t.trim())
    .filter(Boolean);
}

const FALLBACK = (whatItDoes, tech) =>
  `Built a project that ${whatItDoes}, using ${tech.join(", ")}.`;

export async function generate(modelId, whatItDoes, techList) {
  const techItems = splitTech(techList);

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write short, punchy portfolio project descriptions (2-3 sentences) for developers, grounded ONLY in the specific project details and tech stack given — never invent features or technologies not mentioned. " +
          "Mention every technology listed. Reply with ONLY the description, no preamble, no heading.",
      },
      {
        role: "user",
        content: "What it does: lets users upload a CSV and instantly see interactive charts of their data\nTech used: React, Node.js, D3.js",
      },
      {
        role: "assistant",
        content:
          "Built a data visualization tool that turns any uploaded CSV into interactive, explorable charts in seconds. The frontend is React for a responsive upload-and-preview flow, with a Node.js backend handling parsing, and D3.js powering the dynamic chart rendering.",
      },
      { role: "user", content: `What it does: ${whatItDoes}\nTech used: ${techList}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.6, maxTokens: 300 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripWrapping(text);

  let description = looksUnusable(text) ? FALLBACK(whatItDoes, techItems) : text;

  // Deterministically guarantee every listed technology is present — the
  // model can silently drop one item even while formatting everything else
  // correctly.
  const lowerDesc = description.toLowerCase();
  const missing = techItems.filter((t) => !lowerDesc.includes(t.toLowerCase()));
  if (missing.length > 0) {
    description = description.replace(/[.!?]?\s*$/, "");
    description += `. Built with ${techItems.join(", ")}.`;
  }

  return { description };
}
