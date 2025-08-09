"use client";

import { requestDevServer as requestDevServerInner } from "./webview-actions";
import "./loader.css";
import {
  FreestyleDevServer,
  FreestyleDevServerHandle
} from "freestyle-sandboxes/react/dev-server";
import { useRef } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ShareButton } from "./share-button";
import { detectTemplateFromRepo } from "@/lib/zapp";

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

  if (!templateId || templateId === "nextjs-dkjfgdf") {
    templateId = detectTemplateFromRepo(props.repo) || "nextjs";
  }

  // Default behavior for all frameworks - use FreestyleDevServer
  function requestDevServer({ repoId }: { repoId: string }) {
    return requestDevServerInner({ repoId });
  }

  return (
    <div className='flex flex-col overflow-hidden h-screen border-l transition-opacity duration-700 mt-[2px]'>
      <div className='h-12 border-b border-gray-200 items-center flex px-2 bg-background sticky top-0 justify-end gap-2'>
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
            <div className='flex items-center justify-center h-full'>
              <div>
                <div className='text-center'>
                  {templateId === "flutter"
                    ? iframeLoading
                      ? "Flutter Loading"
                      : "Setting up Flutter VM"
                    : iframeLoading
                      ? "JavaScript Loading"
                      : "Starting VM"}
                </div>
                <div>
                  <div className='loader'></div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
