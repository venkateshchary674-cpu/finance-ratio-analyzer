// Vercel serverless function. The API key stays on the server.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const RATIOS = [
  { name: "Net Profit Margin", unit: "%", mult: 100, num: "netProfit", den: "revenue", formula: "Net Profit / Revenue x 100" },
  { name: "Return on Assets (ROA)", unit: "%", mult: 100, num: "netProfit", den: "totalAssets", formula: "Net Profit / Total Assets x 100" },
  { name: "Return on Equity (ROE)", unit: "%", mult: 100, num: "netProfit", den: "totalEquity", formula: "Net Profit / Total Equity x 100" },
  { name: "Debt-to-Equity Ratio", unit: "x", mult: 1, num: "totalDebt", den: "totalEquity", formula: "Total Debt / Total Equity" },
  { name: "Current Ratio", unit: "x", mult: 1, num: "currentAssets", den: "currentLiabilities", formula: "Current Assets / Current Liabilities" }
];

const FIELDS = ["revenue", "netProfit", "totalAssets", "totalEquity", "totalDebt", "currentAssets", "currentLiabilities"];

const SYSTEM_PROMPT = `You are a corporate finance tutor inside a student portfolio app called Finance Ratio Analyzer.
Rules you must follow:
- Use ONLY the inputs and calculated ratios provided in the user message.
- Do NOT invent company names, industries, competitors, benchmarks for a specific industry, trends, forecasts, or any other data.
- You may mention general rules of thumb (for example, a current ratio above 1 means current assets exceed current liabilities), and say they vary by industry.
- If the user asks about something that cannot be answered from the provided numbers, say so briefly.
- Be concise (under 250 words), clear, and professional. Use short paragraphs or simple bullets.
- This is educational information, not investment advice.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the server." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const inputs = body.inputs || {};
  const question = String(body.question || "What do these ratios indicate?").trim().slice(0, 500);

  // Validate inputs
  const values = {};
  for (const f of FIELDS) {
    const raw = inputs[f];
    const n = raw === "" || raw === null || raw === undefined ? NaN : Number(raw);
    if (!Number.isFinite(n)) {
      return res.status(400).json({ error: "All seven inputs must be valid numbers." });
    }
    if (f !== "netProfit" && n < 0) {
      return res.status(400).json({ error: "Only Net Profit may be negative." });
    }
    values[f] = n;
  }
  for (const f of ["revenue", "totalAssets", "totalEquity", "currentLiabilities"]) {
    if (values[f] <= 0) {
      return res.status(400).json({ error: "Revenue, Total Assets, Total Equity and Current Liabilities must be greater than 0." });
    }
  }

  // Recalculate on the server so Claude only sees verified results
  const results = RATIOS.map((r) => {
    const value = (values[r.num] / values[r.den]) * r.mult;
    return `- ${r.name}: ${value.toFixed(2)}${r.unit === "%" ? "%" : "x"} (formula: ${r.formula})`;
  });

  const userMessage =
    `Inputs (same currency units):\n` +
    FIELDS.map((f) => `- ${f}: ${values[f]}`).join("\n") +
    `\n\nCalculated ratios:\n${results.join("\n")}` +
    `\n\nUser question: ${question}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data && data.error && data.error.message ? data.error.message : "Anthropic API request failed.";
      return res.status(502).json({ error: msg });
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ answer: text || "No explanation was returned." });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the Anthropic API." });
  }
};
