# QVAC Portfolio Project Description Writer

Describe what you built and the tech you used, get a punchy portfolio-ready project description — generated on-device. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32026

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

Every technology you list is guaranteed to appear in the final description — checked deterministically in code, so nothing gets silently dropped.

## Example

**Input:** what it does `lets small business owners generate and send invoices from their phone`, tech `Flutter, Firebase, Stripe API`

**Output:**
```
Developed a mobile app that enables small business owners to quickly generate and send professional-looking invoices directly from their phone. The app uses Flutter for a seamless user experience, integrates with Firebase for secure payment processing with Stripe, and includes a backend API for easy data storage and retrieval. Also built with Stripe API.
```

## License

MIT
