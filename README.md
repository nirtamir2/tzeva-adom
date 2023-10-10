# Tzeva Adom Monorepo

This repo includes the code for my unofficial Tzeva Adom extension and apps.

### Disclaimer

This app is open source now - so you can do everything you want.
I'm not responsible to the usage of the app / data correctness.

### Demo with mock Data

![Demo with mock data](./demo-mock-data.gif)

### Running

Vite ui (debugging)

```
pnpm run dev
```

or

```
VITE_USE_PRODUCTION_API=true pnpm run dev
```

and in a different terminal
Tauri:

```
cd tauri
pnpm tauri dev
```

Based on https://github.com/cawa-93/vite-electron-builder

## Install

`yarn`

## Scripts

```bash
"build-dev": "cross-env NODE_ENV=development node esbuild.js",
```

yarn build-dev - build the app with ESBuild

```bash
"run-browser": "web-ext run -s ./public --target chromium --start-url 'https://www.google.com'",
```

yarn run-browser
Runs the ESBuild output in public dir in chromium instance + open "google.com" you can reload extension in this script by pressing "R"

```bash
"watch": "watchexec -e tsx,ts,html -i dist/** yarn run build-dev",
```

Run build-dev after file watch

## Start - dev

Open 2 terminals:

1.  ```bash
    run yarn watch
    ```
    This will run esbuild after every change you make
2.  ```bash
    run yarn dev
    ```
    Focus on this terminal and run R after you want to reload app

## Build - prod

```bash
yarn prod
```

It will clear the public/build directory + build it + zip it into dist directory. You can upload the extension.zip file

For firefox - I manually zip extension files.
