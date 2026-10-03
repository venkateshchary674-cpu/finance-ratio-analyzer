---
name: finance-ratio-analysis
description: Finance Ratio Analysis Skill. Calculates and interprets five core corporate finance ratios (net profit margin, ROA, ROE, debt-to-equity, current ratio) strictly from user-provided figures, without inventing data.
---

# Finance Ratio Analysis Skill

## Purpose
Help users calculate and understand five core financial ratios using only the numbers they provide.

## Required Inputs
All seven must be provided, in the same currency and unit:
Revenue, Net Profit, Total Assets, Total Equity, Total Debt, Current Assets, Current Liabilities.

## Validation Rules
1. Every input must be a valid finite number.
2. Net Profit may be negative (a loss). All other inputs must be zero or greater.
3. Revenue, Total Assets, Total Equity, and Current Liabilities must be greater than 0 (they are denominators).
4. If an input is missing or invalid, say which one and do not calculate the affected ratio.
5. Never guess, estimate, or fill in missing values.

## The Five Ratios

| Ratio | Formula | Meaning |
|---|---|---|
| Net Profit Margin | Net Profit / Revenue × 100 | Share of each unit of sales kept as profit |
| Return on Assets (ROA) | Net Profit / Total Assets × 100 | Profit generated per unit of assets |
| Return on Equity (ROE) | Net Profit / Total Equity × 100 | Profit generated per unit of shareholder equity |
| Debt-to-Equity | Total Debt / Total Equity | How much debt finances the firm relative to equity |
| Current Ratio | Current Assets / Current Liabilities | Ability to cover short-term obligations |

## General Rules of Thumb
These are educational guides only. Acceptable levels vary by industry.

- Net Profit Margin: below 5% is thin, 5–15% is moderate, above 15% is strong.
- ROA: below 5% is low, 5–10% is moderate, above 10% is strong.
- ROE: below 10% is low, 10–20% is reasonable, above 20% is high (check leverage).
- Debt-to-Equity: below 1 is conservative, 1–2 is moderate, above 2 is high leverage.
- Current Ratio: below 1 signals liquidity pressure, 1.5–3 is healthy, above 3 may indicate idle assets.

## How Claude Should Interpret Results

1. Use only the inputs and ratios provided. Do not invent company names, industries, peer benchmarks, historical trends, forecasts, or market data.
2. State each ratio, its value, and what it generally indicates.
3. Connect ratios where the numbers support it.
4. Say that thresholds are general rules of thumb and vary by industry.
5. If the question needs data that was not provided, say it cannot be answered from the given numbers.
6. Keep the tone professional and concise, and note that this is educational and not investment advice.

## Example Output Style

"Net Profit Margin is 12.00%, so about 12 units of every 100 in revenue remain as profit. This is moderate and should be compared with industry norms, which were not provided."
