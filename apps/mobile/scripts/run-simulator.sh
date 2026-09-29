#!/bin/sh
# Baut die App für den iOS-Simulator, startet sie und öffnet den Simulator.
# Gerät wählen: DEVICE="iPhone 17e" sh scripts/run-simulator.sh
set -eu
cd "$(dirname "$0")/.."
DEVICE="${DEVICE:-iPhone 17e}"

sh scripts/sync.sh

xcodebuild \
  -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination "platform=iOS Simulator,name=$DEVICE" \
  -derivedDataPath ios/build \
  CODE_SIGNING_ALLOWED=NO \
  | grep -E "error:|BUILD SUCCEEDED|BUILD FAILED" || true

APP=ios/build/Build/Products/Debug-iphonesimulator/App.app
[ -d "$APP" ] || { echo "Build fehlgeschlagen: $APP fehlt" >&2; exit 1; }

xcrun simctl boot "$DEVICE" 2>/dev/null || true
open -a Simulator 2>/dev/null || true
xcrun simctl install "$DEVICE" "$APP"
xcrun simctl launch "$DEVICE" com.philipphoang.grundumsatz
