# [Planner](https://plannerweb.vercel.app)

An all-in-one daily planner with tasks, an hourly schedule and notes, alongside live widgets for local weather, the time, BRL exchange rates and the Bitcoin price. Designed to feel like a native Apple app, with automatic light and dark mode, on desktop and mobile.

## Features

- **Tasks**: add, rename inline, complete, delete, filter by All / Active / Done and clear completed tasks.
- **Schedule**: half-hour slots from 05:00 to 23:30 for any day, a week strip, a month calendar, a live "now" indicator and options to clear a day or reset everything.
- **Notes**: create, search, edit with autosave and delete. The first line becomes the title.
- **Widgets**:
  - **Weather** for your current location
  - **Clock** with time zone
  - **Exchange** rates for USD and AUD to BRL
  - **Bitcoin** price in USD, AUD and BRL

All data is stored locally in the browser. Data saved by the previous version of the app is migrated automatically.

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) with Svelte 5 runes and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Vite](https://vite.dev) and [Bun](https://bun.sh)
- [Lucide](https://lucide.dev) icons
- Static output via `@sveltejs/adapter-static`, deployed on Vercel

## Getting Started

```sh
git clone https://github.com/RafaelFelic/planner.git
cd planner
bun install
bun run dev
```

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `bun run dev`     | Start the development server        |
| `bun run build`   | Build the static site into `build/` |
| `bun run preview` | Preview the production build        |
| `bun run check`   | Type-check with `svelte-check`      |
| `bun run format`  | Format with Prettier                |

## APIs

None of these require an API key.

- Weather: [Open-Meteo](https://open-meteo.com) with place names from [BigDataCloud](https://www.bigdatacloud.com)
- Exchange rates: [Frankfurter](https://frankfurter.dev) (European Central Bank reference rates)
- Bitcoin: [Blockchain.com ticker](https://www.blockchain.com/explorer/api/exchange_rates_api)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
