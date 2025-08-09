"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon, ExternalLinkIcon } from "lucide-react";
import { ShareButton } from "./share-button";
import {
  createZappGitHubProject,
  generateEmbedUrl,
  FLUTTER_ZAPP_CONFIG,
  type ZappProject,
} from "@/lib/zapp";

export default function ZappView(props: {
  repo: string;
  baseId: string;
  appId: string;
  domain?: string;
  templateId?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zappProject, setZappProject] = useState<ZappProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Create Zapp.run project from repository
    const project = createZappGitHubProject(props.repo, props.templateId);
    console.log('ZappView Debug - Repository:', props.repo);
    console.log('ZappView Debug - Template ID:', props.templateId);
    console.log('ZappView Debug - Generated Project:', project);
    setZappProject(project);
  }, [props.repo, props.templateId]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Force iframe reload
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const handleOpenInZapp = () => {
    if (zappProject) {
      window.open(zappProject.url, '_blank');
    }
  };

  if (!zappProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div>Initializing Flutter Preview</div>
          <div className="loader mt-2"></div>
        </div>
      </div>
    );
  }

  const embedUrl = generateEmbedUrl(zappProject.url, FLUTTER_ZAPP_CONFIG);
  console.log('ZappView Debug - Base URL:', zappProject.url);
  console.log('ZappView Debug - Embed URL:', embedUrl);
  console.log('ZappView Debug - Flutter Config:', FLUTTER_ZAPP_CONFIG);

  return (
    <div className="flex flex-col overflow-hidden h-screen border-l transition-opacity duration-700 mt-[2px]">
      <div className="h-12 border-b border-gray-200 items-center flex px-2 bg-background sticky top-0 justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Flutter Preview</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Powered by Zapp.run
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInZapp}
            title="Open in Zapp.run"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
          <ShareButton domain={props.domain} appId={props.appId} />
        </div>
      </div>
      
      <div className="flex-1 relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div>Loading Flutter App</div>
              <div className="text-xs text-muted-foreground mt-1">
                Compiling with Zapp.run...
              </div>
              <div className="loader mt-2"></div>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="text-red-600 font-semibold">Preview Error</div>
              <div className="text-xs text-muted-foreground mt-1">
                Failed to load Zapp.run preview
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                URL: {embedUrl}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(zappProject.url, '_blank')}
                className="mt-3"
              >
                Open in Zapp.run
              </Button>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            overflow: 'hidden'
          }}
          title="Flutter App Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.error('ZappView Debug - Iframe failed to load');
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
}