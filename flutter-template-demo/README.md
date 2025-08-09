# Flutter Hello World Template

This is a Flutter template designed to work with Freestyle Sandboxes. It automatically sets up the Flutter SDK and runs a simple Hello World app.

## How it works

1. **Automatic Setup**: The `setup-flutter.sh` script automatically installs Flutter SDK when the project starts
2. **Web Development**: Configured to run Flutter web apps with hot reload
3. **Zero Configuration**: No manual setup required - everything happens automatically

## Scripts

- `npm install` - Installs Flutter SDK and gets dependencies
- `npm run dev` - Starts the Flutter web development server
- `npm run build` - Builds the Flutter web app for production
- `npm run doctor` - Runs Flutter doctor to check installation

## Manual Commands

If you want to run Flutter commands directly:

```bash
# Add Flutter to PATH
export PATH="$PATH:/opt/flutter/bin"

# Run Flutter commands
flutter pub get
flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080
flutter doctor
```

## Features

- Simple Hello World Flutter app
- Material Design 3 theme
- Hot reload support
- Responsive design
- Ready for AI code generation and modification

## Development

The main app code is in `lib/main.dart`. Modify this file to change the app behavior.
