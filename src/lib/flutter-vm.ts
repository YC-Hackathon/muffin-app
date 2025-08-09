/**
 * Flutter VM Configuration for Freestyle Sandboxes
 *
 * This configuration creates a custom VM environment with Flutter SDK
 * installed and properly configured for web development.
 */

export interface FlutterVMConfig {
  image: string;
  setup: string[];
  devCommand: string;
  installCommand: string;
  port: number;
  healthCheck: string;
}

/**
 * Primary Flutter VM configuration using official Flutter Docker image
 */
export const FLUTTER_VM_CONFIG: FlutterVMConfig = {
  // Use official Flutter Docker image (fastest setup)
  image: "cirrusci/flutter:stable",

  setup: [
    // Ensure web support is enabled
    "flutter config --enable-web",
    "flutter config --no-analytics",

    // Pre-cache web artifacts for faster subsequent builds
    "flutter precache --web",

    // Verify installation
    "flutter doctor --verbose"
  ],

  // Command to run Flutter web development server
  devCommand:
    "flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080 --hot",

  // Command to install dependencies
  installCommand: "flutter pub get",

  // Port for web server
  port: 8080,

  // Health check command
  healthCheck: "flutter --version"
};

/**
 * Fallback Flutter VM configuration using Ubuntu base image
 * Used if the official Flutter Docker image is not available
 */
export const FLUTTER_VM_CONFIG_FALLBACK: FlutterVMConfig = {
  image: "ubuntu:22.04",

  setup: [
    // Update package lists
    "apt-get update",

    // Install essential dependencies
    "apt-get install -y curl git unzip xz-utils zip libglu1-mesa ca-certificates",

    // Download and install Flutter SDK
    "cd /tmp",
    "curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz",
    "tar xf flutter_linux_3.24.5-stable.tar.xz",
    "mv flutter /opt/flutter",

    // Add Flutter to PATH permanently
    "echo 'export PATH=\"$PATH:/opt/flutter/bin\"' >> /etc/environment",
    "echo 'export PATH=\"$PATH:/opt/flutter/bin\"' >> /root/.bashrc",
    'export PATH="$PATH:/opt/flutter/bin"',

    // Configure Flutter for web development
    "flutter config --enable-web",
    "flutter config --no-analytics",

    // Pre-cache web artifacts
    "flutter precache --web",

    // Verify installation
    "flutter doctor --verbose"
  ],

  devCommand:
    'export PATH="$PATH:/opt/flutter/bin" && flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080 --hot',
  installCommand: 'export PATH="$PATH:/opt/flutter/bin" && flutter pub get',
  port: 8080,
  healthCheck: "flutter --version || /opt/flutter/bin/flutter --version"
};

/**
 * Get Flutter VM configuration with fallback support
 */
export function getFlutterVMConfig(): FlutterVMConfig {
  // For now, return the primary config
  // In the future, we could add logic to detect which works best
  return FLUTTER_VM_CONFIG;
}
