/**
 * Zapp.run integration utilities for Flutter project embedding
 * https://docs.zapp.run/features/share-and-embed
 */

export interface ZappProject {
  id: string;
  url: string;
  embedUrl: string;
  type: 'github' | 'gist' | 'pub' | 'direct';
}

export interface ZappEmbedConfig {
  split?: number; // 0-100: split view percentage (0=preview only, 100=editor only)
  lazy?: boolean; // lazy load to reduce initial bandwidth
  theme?: 'light' | 'dark';
}

/**
 * Create a Zapp.run project URL from a repository
 */
export function createZappGitHubProject(repoId: string): ZappProject {
  // For Flutter projects, use the local flutter-template-demo structure
  if (repoId.includes('flutter') || shouldUseZappPreview(detectTemplateFromRepo(repoId) || '')) {
    // Use a basic Flutter template from Zapp.run for now
    // This will show the Flutter preview interface
    const url = `https://zapp.run/edit/flutter`;
    const embedUrl = generateEmbedUrl(url);
    
    return {
      id: repoId,
      url,
      embedUrl,
      type: 'direct'
    };
  }
  
  // Convert freestyle repo ID to GitHub path format for other repos
  const githubPath = repoId.replace(/^freestyle-/, ''); // Remove freestyle prefix if present
  
  const url = `https://zapp.run/github/${githubPath}`;
  const embedUrl = generateEmbedUrl(url);
  
  return {
    id: repoId,
    url,
    embedUrl,
    type: 'github'
  };
}

/**
 * Generate an embed URL with configuration options
 */
export function generateEmbedUrl(baseUrl: string, config: ZappEmbedConfig = {}): string {
  const url = new URL(baseUrl);
  
  // Add split view configuration
  if (config.split !== undefined) {
    url.searchParams.set('split', config.split.toString());
  }
  
  // Add lazy loading
  if (config.lazy) {
    url.searchParams.set('lazy', 'true');
  }
  
  // Add theme
  if (config.theme) {
    url.searchParams.set('theme', config.theme);
  }
  
  return url.toString();
}

/**
 * Create an iframe element for embedding Zapp.run projects
 */
export function createZappIframe(project: ZappProject, config: ZappEmbedConfig = {}): string {
  const embedUrl = generateEmbedUrl(project.url, config);
  
  return `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: 0; overflow: hidden;"></iframe>`;
}

/**
 * Detect template type from repository URL
 */
export function detectTemplateFromRepo(repoUrl: string): string | null {
  // Match against known template repositories
  const templateRepoMap: Record<string, string> = {
    'freestyle-base-nextjs-shadcn': 'nextjs',
    'freestyle-base-vite-react-typescript-swc': 'vite',
    'freestyle-expo': 'expo',
    'freestyle-base-flutter': 'flutter',
    'flutter-sample-app-hello-world': 'flutter', // Temporary Flutter template
  };
  
  // Extract repo name from URL
  for (const [repoName, templateId] of Object.entries(templateRepoMap)) {
    if (repoUrl.includes(repoName)) {
      return templateId;
    }
  }
  
  // Also check for flutter in the repo URL for demo purposes
  if (repoUrl.toLowerCase().includes('flutter')) {
    return 'flutter';
  }
  
  return null;
}

/**
 * Check if a template/repo should use Zapp.run for preview
 */
export function shouldUseZappPreview(templateId: string): boolean {
  return templateId === 'flutter';
}

/**
 * Default configuration for Flutter projects in Zapp.run
 */
export const FLUTTER_ZAPP_CONFIG: ZappEmbedConfig = {
  split: 30, // 30% editor, 70% preview - optimized for mobile preview
  theme: 'light',
  lazy: false, // Load immediately for better UX
};