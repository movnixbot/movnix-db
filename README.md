# 🎬 Movnix Static Database

<p align="center">
  <img src="https://img.shields.io/github/stars/movnixbot/movnix-db?style=flat-square&color=black" alt="Stars" />
  <img src="https://img.shields.io/github/forks/movnixbot/movnix-db?style=flat-square&color=black" alt="Forks" />
  <img src="https://img.shields.io/github/license/movnixbot/movnix-db?style=flat-square&color=black" alt="License" />
  <img src="https://img.shields.io/badge/API-Static%20JSON-black?style=flat-square" alt="API" />
</p>

Welcome to the official **Movnix Static Database** storage repository. 

This repository acts as a highly optimized, flat-file JSON API database powered by the **MovnixBot** daemon crawler. It is automatically synced and updated daily from official TMDB, OMDB, and public web sources.

---

## 📊 Database Statistics

* 🎬 **Total Movies**: `43`
* 📺 **Total TV Series**: `54`
* 🎞️ **Total Episodes**: `4679`
* 🏷️ **Total Genres**: `9325`

---

## 🗂️ API Structure

All resource records are exported as standalone, high-fidelity JSON files:
* 🎥 **Movies**: [`movies/{tmdbId}.json`](./movies/)
* 📺 **TV Series**: [`tv/{tmdbId}.json`](./tv/)
* 🔍 **Search Index**: [`search-index.json`](./search-index.json) (Pre-built Fuse.js index)

---

## 🔗 CDN Access (Zero-Latency API)

You can consume these JSON files directly via jsDelivr CDN without setting up any database or server:
* **Movie Fetch**: `https://cdn.jsdelivr.net/gh/movnixbot/movnix-db@main/movies/{tmdbId}.json`
* **TV Show Fetch**: `https://cdn.jsdelivr.net/gh/movnixbot/movnix-db@main/tv/{tmdbId}.json`
* **Search Index Fetch**: `https://cdn.jsdelivr.net/gh/movnixbot/movnix-db@main/search-index.json`

---

## 📦 Developer Client SDK

To easily search and query this database in your JavaScript/TypeScript projects, install the official [**movnix-sdk**](https://github.com/movnixbot/movnix-sdk) from NPM:

```bash
npm install movnix-sdk
```

*Last updated: ${new Date().toUTCString()} | Generated and published by [MovnixBot Daemon](https://github.com/movnixbot/movnix-bot)*