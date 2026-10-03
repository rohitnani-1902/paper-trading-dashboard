# Paperfolio — Paper Trading Dashboard

A local, interactive simulated-order dashboard for learning portfolio state and trade journaling.

## Run it

Open `index.html` in a modern browser. No install, broker account, API key, or server is involved.

## Features

- Starts with a $25,000 simulated cash account
- Uses a small board of clearly fictional, static asset quotes
- Simulates whole-share buys and sells
- Tracks cash, holdings, average cost, market value, and unrealized P/L
- Keeps a visible paper-trade journal
- Prevents orders that exceed simulated cash or holdings

## Important disclaimer

All assets and prices are fictional. This project cannot connect to a broker, trade real money, or provide investment advice. It demonstrates local frontend state management and basic portfolio arithmetic only.

## Tech

Single-file HTML, CSS, and JavaScript.

## Extension ideas

- Price-feed adapter with a clearly licensed source
- Persistent local trade journal
- Limit / stop-order simulator
- Position allocation and risk constraints

---

Part of [Rohit's GitHub portfolio](https://github.com/rohitnani-1902).
## Accounting and validation

Orders require a positive safe integer quantity. Fractional, empty, non-finite and oversized inputs are rejected without changing cash or holdings. Insufficient-cash and oversell checks run before account changes. Cash is rounded to whole cents after each trade; average cost retains precision for weighted calculations.

Export journal downloads the current session's messages in chronological order as a text file, including rejected orders. Export before resetting or reloading: the journal is kept only in memory.

## Repeatable checks

Run `node tests/accounting.test.cjs` with Node.js. Checks cover invalid quantities, insufficient cash, overselling, partial and full sales, weighted cost, reset, and 100 repeated buy/sell round trips without cash drift.

Example: buy 10 NOVA at $128.40 → cash $23,716.00 and holdings $1,284.00. Sell four → cash $24,229.60 and six remaining shares. Selling the remaining six restores $25,000.00. Static quotes and zero fees keep total account value unchanged; this verifies bookkeeping, not trading returns.
