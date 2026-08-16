# dsh-turn-rail

[中文说明](README.zh.md)

A right-side session turn navigation rail for DeepSeek Harness Web, replicating the official DeepSeek page style:

- Collapsed: a 34px frosted pill at the right edge; one small gray marker per user turn, the active turn is blue and stretched.
- Hover / keyboard focus: expands into a 240px floating panel with one row per user message.
- scrollspy keeps the active marker in sync while scrolling.
- Opening a session auto-pages older history, so every historical turn appears in the rail without manual scrolling.

## Screenshot

![dsh-turn-rail screenshot](docs/screenshot.png)

## One-line install

Prerequisite: DeepSeek Harness Web is installed and running (`npx @deepseek-ai/dsh web` or `pnpm dsh web`), and both `dsh` and `pnpm` are on PATH.

```sh
dsh plugin --profile web add github:Luoji-Yuli/dsh-turn-rail
```

A successful install prints `+ @deepseek-ai/dsh-turn-rail ...`.

If `dsh web` is running, restart it and refresh the page.

Local directory install (development):

```sh
dsh plugin --profile web add link:./dsh-turn-rail
```

## Start

```sh
dsh web
```

Open `http://127.0.0.1:3080` and hard-refresh with **Ctrl + F5**. Open any session with at least 2 user messages; the rail appears at the right edge of the page.

## Uninstall

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-turn-rail
```

## Repository layout

```
dsh-turn-rail/
  package.json          # declares both dsh.bundle and dsh.client
  cordis.patch.yml      # inserts one plugin row into the web profile
  docs/
    screenshot.png      # UI screenshot
  lib/
    index.js            # host-side no-op plugin (so the loader can import it)
    client.js           # prebuilt browser bundle (works out of the box)
    types/              # TypeScript declarations
  src/                  # plugin source (browser component + host no-op)
  tests/                # component tests
  tsconfig.json         # TS config used when building inside the deepseek-harness monorepo
  tsdown.config.ts      # bundle config used when building inside the deepseek-harness monorepo
```

## Building from source

This repo ships a prebuilt `lib/client.js`, so normal installs do not need a build step.

After editing files under `src/`, mirror them into the `deepseek-harness` monorepo at:

```
packages/client/ui-turn-rail/
```

Then run:

```sh
pnpm install
pnpm --filter @deepseek-ai/dsh-turn-rail run bundle
```

Commit the regenerated `lib/client.js` back to this repo.
