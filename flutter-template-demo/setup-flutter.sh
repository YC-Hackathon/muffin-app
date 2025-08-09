#!/bin/bash

# Flutter Setup Script for Freestyle Sandboxes
# This script installs Flutter SDK if it's not already available

echo "🚀 Checking Flutter installation..."

# Set Flutter directory
FLUTTER_DIR="$HOME/flutter"
FLUTTER_BIN="$FLUTTER_DIR/bin/flutter"

# Check if Flutter is already installed
if [ -f "$FLUTTER_BIN" ]; then
    echo "✅ Flutter is already installed at $FLUTTER_DIR"
    export PATH="$PATH:$FLUTTER_DIR/bin"
    flutter --version
    exit 0
fi

echo "📦 Installing Flutter SDK to $FLUTTER_DIR..."

# Create flutter directory
mkdir -p "$FLUTTER_DIR"

# Download Flutter SDK
echo "⬇️ Downloading Flutter SDK..."
cd /tmp
curl -fsSL https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz -o flutter.tar.xz

# Extract Flutter
echo "📂 Extracting Flutter..."
tar xf flutter.tar.xz

# Move to home directory
echo "📁 Installing Flutter to $FLUTTER_DIR..."
mv flutter/* "$FLUTTER_DIR/"
rmdir flutter

# Add Flutter to PATH
echo "🔗 Adding Flutter to PATH..."
export PATH="$PATH:$FLUTTER_DIR/bin"
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.bashrc

# Configure Flutter
echo "⚙️ Configuring Flutter..."
flutter config --enable-web --no-analytics

# Pre-cache web artifacts (this may take a while)
echo "📱 Pre-caching web artifacts..."
flutter precache --web

# Run Flutter doctor
echo "🩺 Running Flutter doctor..."
flutter doctor --verbose

echo "✅ Flutter installation complete!"
echo "🎉 You can now run: flutter run -d web-server"