#!/bin/sh
# Baut die Website als App-Variante (Links mit index.html, Capacitor-Plugins) und kopiert sie ins Xcode-Projekt.
set -eu
cd "$(dirname "$0")/.."
(cd ../web && APP_BUILD=1 PUBLIC_APP=1 BASE_PATH=/ npx astro build >/dev/null)
npx cap sync ios >/dev/null
echo "App-Inhalte aktualisiert (ios/App/App/public)"
