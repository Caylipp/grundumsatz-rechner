#!/bin/sh
# Baut eine unsignierte iOS-IPA (Release) für LiveContainer, SideStore oder AltStore.
# Diese signieren die App beim Import selbst. Ergebnis: dist/Grundumsatz.ipa
set -eu
cd "$(dirname "$0")/.."

sh scripts/sync.sh

xcodebuild \
  -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath ios/build \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" \
  | grep -E "error:|BUILD SUCCEEDED|BUILD FAILED" || true

APP=ios/build/Build/Products/Release-iphoneos/App.app
[ -d "$APP" ] || { echo "Build fehlgeschlagen: $APP fehlt" >&2; exit 1; }

rm -rf dist/ipa && mkdir -p dist/ipa/Payload
cp -R "$APP" dist/ipa/Payload/Grundumsatz.app
(cd dist/ipa && zip -qry ../Grundumsatz.ipa Payload)
rm -rf dist/ipa
# ZIP-Variante für AirDrop: Eine nackte IPA würde iOS selbst zu installieren versuchen.
(cd dist && rm -f Grundumsatz.ipa.zip && zip -q Grundumsatz.ipa.zip Grundumsatz.ipa)
echo "Fertig: dist/Grundumsatz.ipa ($(du -h dist/Grundumsatz.ipa | cut -f1)) und dist/Grundumsatz.ipa.zip"
