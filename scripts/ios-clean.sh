#!/usr/bin/env bash
set -euo pipefail

echo "🔧 iOS clean build helper"

pushd "$(dirname "$0")/.." >/dev/null

APP_ROOT="$PWD"
IOS_DIR="$APP_ROOT/ios"

echo "🧹 Killing Metro if running..."
pkill -f "react-native start" || true

echo "🧹 Quitting Xcode/Simulator if running..."
pkill -f "Xcode" || true
pkill -f "Simulator" || true
pkill -f "xcodebuild|XCBBuildService|swift|PIF|SourceKitService" || true

echo "🧽 Removing DerivedData & caches..."
DERIVED=~/Library/Developer/Xcode/DerivedData
rm -rf "$DERIVED" || true
rm -rf ~/Library/Developer/Xcode/ModuleCache.noindex || true
rm -rf ~/Library/Caches/com.apple.dt.Xcode || true
rm -rf ~/Library/Caches/com.apple.dt.XCBuild || true
rm -rf ~/Library/Caches/org.swift.swiftpm || true
rm -rf ~/Library/Developer/Xcode/SourcePackages || true

echo "🧽 Cleaning iOS build artifacts..."
rm -rf "$IOS_DIR/build" || true

echo "🧽 Cleaning Pods and Lockfile..."
rm -rf "$IOS_DIR/Pods" || true
rm -f "$IOS_DIR/Podfile.lock" || true

echo "📦 Installing pods..."
cd "$IOS_DIR"
if command -v bundle >/dev/null 2>&1; then
  bundle install
  bundle exec pod install
else
  pod install
fi

popd >/dev/null

echo "✅ Done. Open MeseriasLocalAppNew.xcworkspace and Build."
