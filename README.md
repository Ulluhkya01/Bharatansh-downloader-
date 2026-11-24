# Bharatansh Downloader

A responsive dark-themed Node.js starter for Instagram and Facebook video links.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and configure an authorized provider if you have one.
4. Run `npm start`.
5. Open http://localhost:3000

## Important: enabling downloads
The UI and API server are implemented. Actual Instagram/Facebook share-link resolution is intentionally not faked: platform links generally require an official or otherwise authorized API/provider and appropriate user authorization. Add a provider-specific adapter in `server.js` only after confirming it can return content the user owns or has permission to download. Do not scrape private content, request platform passwords, or bypass access controls, DRM, or privacy settings.

The current API validates HTTPS URLs against the supported platform hostnames and returns a clear setup message until a provider adapter is configured.
