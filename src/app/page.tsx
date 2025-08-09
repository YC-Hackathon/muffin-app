"use client";

import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import Image from "next/image";
import LogoSvg from "@/logo.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { UserButton } from "@stackframe/stack";
import { UserApps } from "@/components/user-apps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptInputTextareaWithTypingAnimation } from "@/components/prompt-input";

const queryClient = new QueryClient();

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    router.push(
      `/app/new?message=${encodeURIComponent(prompt)}&template=${framework}`
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background">
        {/* Simple Header */}
        <header className="p-4 sm:p-6">
          <div className="flex w-full justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-lg font-semibold text-foreground">
              <a href="https://www.freestyle.sh" className="hover:text-accent transition-colors">
                muffin.dev
              </a>
            </h1>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Hero Section - Clean and Minimal */}
        <div className="flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-3xl mx-auto text-center space-y-6">
            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Build apps with
                <span className="block text-accent">natural language</span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto">
                Describe your idea and watch it become a fully functional app. No coding skills required.
              </p>
            </div>

            {/* Extra spacing after description */}
            <div className="py-4"></div>

            {/* Main Input - Clean like the image */}
            <div className="w-full max-w-xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-accent/30 focus-within:border-accent/50">
                <div className="space-y-2">
                  <div className="flex-1">
                    <PromptInput
                      isLoading={isLoading}
                      value={prompt}
                      onValueChange={setPrompt}
                      onSubmit={handleSubmit}
                      className="border-none bg-transparent shadow-none p-0"
                    >
                      <PromptInputTextareaWithTypingAnimation />
                    </PromptInput>
                  </div>
                  <div className="flex items-center justify-between">
                    <FrameworkSelector
                      value={framework}
                      onChange={setFramework}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !prompt.trim()}
                      className="bg-accent hover:bg-accent/90 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 shrink-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">Creating...</span>
                        </div>
                      ) : (
                        <span>Create →</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified Examples */}
            <Examples setPrompt={setPrompt} />
          </div>
        </div>

        {/* User Apps Section */}
        <div className="mt-8">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <UserApps />
          </div>
        </div>

        {/* Simple Footer */}
        <footer className="py-4">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm text-foreground-tertiary">
              Powered by{" "}
              <a 
                href="https://freestyle.sh" 
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                muffin.dev
              </a>
            </p>
          </div>
        </footer>
      </main>
    </QueryClientProvider>
  );
}

function Examples({ setPrompt }: { setPrompt: (text: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-foreground-tertiary text-sm">Try these examples:</p>
      <div className="flex flex-wrap justify-center gap-2">
        <ExampleButton
          text="Dog Food Marketplace"
          promptText="Build a dog food marketplace where users can browse and purchase premium dog food."
          onClick={(text) => {
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Personal Website"
          promptText="Create a personal website with portfolio, blog, and contact sections."
          onClick={(text) => {
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Burrito B2B SaaS"
          promptText="Build a B2B SaaS for burrito shops to manage inventory, orders, and delivery logistics."
          onClick={(text) => {
            setPrompt(text);
          }}
        />
      </div>
    </div>
  );
}
