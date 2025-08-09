"use client";

import { requestDevServer as requestDevServerInner } from "./webview-actions";
import "./loader.css";
import {
  FreestyleDevServer,
  FreestyleDevServerHandle,
} from "freestyle-sandboxes/react/dev-server";
import { useRef } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ShareButton } from "./share-button";
import { detectTemplateFromRepo, shouldUseZappPreview } from "@/lib/zapp";
import ZappView from "./zapp-view";

export default function WebView(props: {
  repo: string;
  baseId: string;
  appId: string;
  domain?: string;
}) {
  // Always call hooks at the top level
  const devServerRef = useRef<FreestyleDevServerHandle>(null);

  // Use baseId as the template ID (stored during app creation)
  // For older apps or UUID repos, we need a different approach
  let templateId = props.baseId;
  
  // For debugging: let's manually detect Flutter for now
  // TODO: This is a temporary fix for existing apps
  const isFlutterForced = process.env.NODE_ENV === 'development' && 
    (props.baseId === 'nextjs-dkjfgdf' || !props.baseId); // Default baseId means it might be an old app
  
  if (isFlutterForced) {
    console.log('WebView Debug - Checking if this might be a Flutter app...');
    // You can manually set this to 'flutter' to test existing apps
    // templateId = 'flutter'; // Uncomment this line to force Flutter preview for testing
  }
  
  if (!templateId || templateId === 'nextjs-dkjfgdf') {
    templateId = detectTemplateFromRepo(props.repo) || 'nextjs';
  }
  
  const useZappPreview = shouldUseZappPreview(templateId);
  
  // Debug logging
  console.log('WebView Debug - Repository:', props.repo);
  console.log('WebView Debug - Base ID (Template):', props.baseId);
  console.log('WebView Debug - Should Use Zapp Preview:', useZappPreview);

  // Default behavior for other frameworks
  function requestDevServer({ repoId }: { repoId: string }) {
    return requestDevServerInner({ repoId });
  }

  // If Flutter project, use Zapp.run preview
  if (useZappPreview) {
    return (
      <ZappView
        repo={props.repo}
        baseId={props.baseId}
        appId={props.appId}
        domain={props.domain}
        templateId={templateId}
      />
    );
  }

  return (
    <div className="flex flex-col overflow-hidden h-screen border-l transition-opacity duration-700 mt-[2px]">
      <div className="h-12 border-b border-gray-200 items-center flex px-2 bg-background sticky top-0 justify-end gap-2">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => devServerRef.current?.refresh()}
        >
          <RefreshCwIcon />
        </Button>
        <ShareButton domain={props.domain} appId={props.appId} />
      </div>
      <FreestyleDevServer
        ref={devServerRef}
        actions={{ requestDevServer }}
        repoId={props.repo}
        loadingComponent={({ iframeLoading, devCommandRunning }) =>
          !devCommandRunning && (
            <div className="flex items-center justify-center h-full">
              <div>
                <div className="text-center">
                  {iframeLoading ? "JavaScript Loading" : "Starting VM"}
                </div>
                <div>
                  <div className="loader"></div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
