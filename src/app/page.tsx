"use client";

import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import Image from "next/image";
import LogoSvg from "@/logo.svg";
import muffinLogo from "@/muffin.png";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { UserButton } from "@stackframe/stack";
import { UserApps } from "@/components/user-apps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptInputTextareaWithTypingAnimation } from "@/components/prompt-input";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

// Flutter Particles Animation Component
function FlutterParticles() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, opacity: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y - p.speed,
        opacity: p.y < 0 ? Math.random() * 0.6 + 0.2 : p.opacity
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: `rgba(255, 64, 0, ${particle.opacity})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 64, 0, ${particle.opacity * 0.5})`,
            transform: `translateY(${particle.y < 0 ? window.innerHeight : 0}px)`
          }}
        />
      ))}
    </div>
  );
}

// Typewriter Text Effect Component
function TypewriterText({ delay = 0 }: { delay?: number }) {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const statements = [
    "I want to build Food recommender",
    "I want to build Workout tracker", 
    "I want to build Budget controller",
    "I want to build Task manager",
    "I want to build Social media app",
    "I want to build E-commerce platform",
    "I want to build Learning app",
    "I want to build Fitness tracker",
    "I want to build Recipe finder",
    "I want to build Travel planner"
  ];

  // Safe zones where text can appear (avoiding content areas)
  const getSafePosition = () => {
    const textWidth = 300;
    const textHeight = 50;
    
    // Use viewport dimensions to ensure text stays on screen
    const viewportWidth = Math.min(window.innerWidth, 1920); // Cap at reasonable max
    const viewportHeight = Math.min(window.innerHeight, 1080); // Cap at reasonable max
    
    // Define truly empty areas that stay within viewport bounds
    const safeZones = [
      // Far left margin (but not too far)
      { x: 20, y: 200, width: 150, height: 100 },
      // Far right margin (but not too far)
      { x: Math.max(viewportWidth - 320, 20), y: 200, width: 150, height: 100 },
      // Top margin (but not too high)
      { x: 200, y: Math.max(50, 20), width: 200, height: 80 },
      // Bottom margin (but not too low)
      { x: 200, y: Math.max(viewportHeight - 130, 20), width: 200, height: 80 },
      // Left side middle
      { x: 20, y: 400, width: 150, height: 120 },
      // Right side middle
      { x: Math.max(viewportWidth - 320, 20), y: 400, width: 150, height: 120 }
    ];
    
    // Pick a random safe zone
    const randomZone = safeZones[Math.floor(Math.random() * safeZones.length)];
    
    // Generate position within the safe zone, ensuring it stays on screen
    const x = Math.max(20, Math.min(viewportWidth - textWidth - 20, 
      randomZone.x + Math.random() * (randomZone.width - textWidth)));
    const y = Math.max(20, Math.min(viewportHeight - textHeight - 20, 
      randomZone.y + Math.random() * (randomZone.height - textHeight)));
    
    return { x, y };
  };

  useEffect(() => {
    if (isTyping && currentText.length < statements[currentIndex].length) {
      const timer = setTimeout(() => {
        setCurrentText(statements[currentIndex].slice(0, currentText.length + 1));
      }, 80); // Faster typing speed

      return () => clearTimeout(timer);
    } else if (isTyping && currentText.length === statements[currentIndex].length) {
      // Wait a bit, then start erasing
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (!isTyping && currentText.length > 0) {
      // Erase one character at a time
      const timer = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
      }, 50); // Faster erasing speed

      return () => clearTimeout(timer);
    } else if (!isTyping && currentText.length === 0) {
      // Text is completely erased, wait before starting next cycle
      const timer = setTimeout(() => {
        // Get safe position that won't overlap content
        setPosition(getSafePosition());
        setIsTyping(true);
        setCurrentIndex(prev => (prev + 1) % statements.length);
      }, delay + Math.random() * 2000 + 1000); // Faster: 1-3 seconds + delay

      return () => clearTimeout(timer);
    }
  }, [isTyping, currentText, currentIndex, statements.length, delay]);

  return (
    <div 
      className="fixed pointer-events-none z-20 text-[#ff4000] font-mono text-sm opacity-80"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(0%, -100%)' // Align to left edge of text
      }}
    >
      {currentText}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}

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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B0C0A] to-[#141311]">
        {/* Flutter Particles Background */}
        <FlutterParticles />
        
        {/* Multiple Typewriter Text Effects */}
        <TypewriterText delay={0} />
        <TypewriterText delay={1500} />
        <TypewriterText delay={3000} />
        
        <main className="relative z-10">
          <Hero 
            prompt={prompt}
            setPrompt={setPrompt}
            framework={framework}
            setFramework={setFramework}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
          <Features />
          <SocialProof />
          {/* <UserAppsSection /> */}
          <Footer />
        </main>
      </div>
    </QueryClientProvider>
  );
}

function Hero({ 
  prompt, 
  setPrompt, 
  framework, 
  setFramework, 
  isLoading, 
  handleSubmit 
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  framework: string;
  setFramework: (value: string) => void;
  isLoading: boolean;
  handleSubmit: () => void;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
      {/* Header with UserButton */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20">
        <div className="flex w-full justify-between items-center max-w-5xl mx-auto">
          <h1 className="text-lg font-semibold text-[#F2F1EE]">
            <a href="https://www.freestyle.sh" className="hover:text-[#ff4000] transition-colors">
              muffin.dev
            </a>
          </h1>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Logo with Spotlight Effect */}
      <div className="mb-8 flex justify-center">
        <div className="relative group">
          {/* Top-down torch cone effect - starts narrow at top, spreads to match website content width */}
          <div className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-[calc(100vw-3rem)] max-w-5xl h-[32rem] bg-gradient-to-b from-[#ff4000] via-[#ff6600] via-[#ff4000]/60 to-transparent opacity-40 blur-sm group-hover:opacity-60 transition-all duration-1000" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          
          {/* Main logo with crazy animations */}
          <Image
            src={muffinLogo}
            alt="Muffin Logo"
            width={80}
            height={80}
            className="rounded-lg relative z-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 hover:animate-bounce float-animation"
          />
          
          {/* Floating code symbols around logo */}
          <div className="absolute -top-2 -right-2 text-[#ff4000] text-xs font-mono animate-bounce">{"{}"}</div>
          <div className="absolute -bottom-2 -left-2 text-[#ff4000] text-xs font-mono animate-bounce" style={{animationDelay: '0.5s'}}>{"()"}</div>
          <div className="absolute -top-1 -left-1 text-[#ff4000] text-xs font-mono animate-bounce" style={{animationDelay: '1s'}}>{"[]"}</div>
        </div>
      </div>
      {/* <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[rgba(242,241,238,0.08)] bg-[rgba(20,19,17,0.6)] px-3 py-1.5 text-lg text-[#B6B3AD] fade-in-up">
        <span className="inline-block h-1.5 w-1.5 rounded-sm bg-[#ff4000] pulse-animation" />
        Focused. Quiet. Reliable.
      </div> */}
      {/* Enhanced Title with Gradient and Floating Symbols */}
      <div className="relative mb-8">
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-[#F2F1EE] sm:text-6xl md:text-7xl relative z-10 fade-in-up stagger-1">
          <span className="inline-block">
            Building Flutter apps
          </span>
          <br />
          <span className="inline-block bg-gradient-to-r from-[#ff4000] via-[#ff6600] to-[#ff4000] bg-clip-text text-transparent">
            doesn't have to suck.
          </span>
        </h1>
        
        {/* Floating code transformation particles */}
        <div className="absolute -top-4 -right-4 text-[#ff4000] text-2xl font-mono animate-ping opacity-75">{"→"}</div>
        <div className="absolute -bottom-4 -left-4 text-[#ff4000] text-2xl font-mono animate-ping opacity-75" style={{animationDelay: '0.3s'}}>{"⚡"}</div>
        <div className="absolute top-1/2 -right-8 text-[#ff4000] text-xl font-mono animate-bounce">{"</>"}</div>
      </div>
      <p className="mt-4 max-w-2xl text-pretty text-xl leading-relaxed text-[#B6B3AD] fade-in-up stagger-2">
        A code agent that turns product intent into production Flutter. No theatrics—just clean architecture, theming, and tests, shipped fast.
      </p>
      
      {/* Chat Input Integration */}
      <div className="mt-8 w-full max-w-2xl fade-in-up stagger-3">
        <div className="bg-[rgba(18,17,15,0.6)] border border-[rgba(242,241,238,0.08)] rounded-lg p-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#ff4000]/30 focus-within:border-[#ff4000]/50 focus-within:shadow-lg focus-within:shadow-[#ff4000]/10 enhanced-hover">
          <div className="space-y-3">
            <div className="flex-1 relative">
              <PromptInput
                isLoading={isLoading}
                value={prompt}
                onValueChange={setPrompt}
                onSubmit={handleSubmit}
                className="border-none bg-transparent shadow-none p-0 text-[#F2F1EE] placeholder:text-[#8E8B85]"
              >
                <PromptInputTextareaWithTypingAnimation />
              </PromptInput>
              {!prompt && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="shimmer-effect h-full w-full rounded opacity-20" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <FrameworkSelector
                value={framework}
                onChange={setFramework}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className="group relative inline-flex items-center rounded-md border border-[rgba(242,241,238,0.12)] bg-[rgba(24,23,21,0.7)] px-5 py-2.5 text-lg font-medium text-[#F2F1EE] transition-all duration-300 hover:border-[#ff4000] hover:bg-[rgba(24,23,21,0.85)] hover:scale-105 hover:shadow-lg hover:shadow-[#ff4000]/25 disabled:opacity-50"
              >
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#ff4000] to-[#ff6600] opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Cook</span>
                      <span className="text-[#ff4000] transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">{"→"}</span>
                    </>
                  )}
                </span>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-md bg-[#ff4000] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <Examples setPrompt={setPrompt} />
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Intent → code",
      desc: "Understands your product brief and outputs Flutter with state, routes, and tests.",
    },
    {
      title: "Design-aware",
      desc: "Material 3 and Cupertino fluent. Themes align with your brand out-of-the-box.",
    },
    {
      title: "Clean architecture",
      desc: "Layered modules, clear boundaries, and strong typing—no tangled glue.",
    },
    {
      title: "Ship faster",
      desc: "From idea to preview in minutes. Keep focus on product, not boilerplate.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-5xl px-6 pb-8">
      <div className="grid gap-12 grid-cols-1 sm:grid-cols-2">
        {items.map((f, index) => (
          <Card 
            key={f.title} 
            title={f.title} 
            desc={f.desc} 
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function Card({ title, desc, index }: { title: string; desc: string; index: number }) {
  const [hover, setHover] = useState(false);
  const staggerClass = `stagger-${index + 1}` as const;
  
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-[rgba(242,241,238,0.12)] bg-[rgba(18,17,15,0.6)] p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff4000]/25 hover:border-[#ff4000] fade-in-up",
        staggerClass
      )}
    >
      {/* Glowing effect like the button */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff4000] to-[#ff6600] opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
      
      {/* Ripple effect like the button */}
      <div className="absolute inset-0 rounded-lg bg-[#ff4000] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      {/* Ensure border is visible */}
      <div className="absolute inset-0 rounded-lg border border-[rgba(242,241,238,0.12)] pointer-events-none group-hover:border-[#ff4000] transition-colors duration-300"></div>
      
      {/* Content with crazy animations */}
      <div className="relative z-10">
        <h3 className="mb-2 text-lg font-medium text-[#F2F1EE] group-hover:text-[#ff4000] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-lg leading-relaxed text-[#B6B3AD] group-hover:text-[#F2F1EE] transition-colors duration-300">
          {desc}
        </p>
        
        {/* Animated divider */}
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-[#ff4000] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        
        {/* "Learn more" with arrow like the button */}
        <div className="mt-3 inline-flex items-center text-base text-[#8E8B85] group-hover:text-[#ff4000] transition-colors duration-300">
          <span className="mr-2">Learn more</span>
          <span className="text-[#ff4000] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">{"→"}</span>
        </div>
      </div>
      
      {/* Floating code particles on hover */}
      {hover && (
        <>
          <div className="absolute top-2 right-2 text-[#ff4000] text-xs font-mono animate-bounce opacity-75">{"{}"}</div>
          <div className="absolute bottom-2 left-2 text-[#ff4000] text-xs font-mono animate-bounce opacity-75" style={{animationDelay: '0.2s'}}>{"()"}</div>
        </>
      )}
    </div>
  );
}

function SocialProof() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="fade-in-up">
        <a
          href="#"
          className="group relative inline-flex items-center rounded-md border border-[rgba(242,241,238,0.12)] bg-[rgba(24,23,21,0.7)] px-5 py-2.5 text-lg font-medium text-[#F2F1EE] transition-all duration-300 hover:border-[#ff4000] hover:bg-[rgba(24,23,21,0.85)] hover:scale-105 hover:shadow-lg hover:shadow-[#ff4000]/25"
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#ff4000] to-[#ff6600] opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          
          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2">
            <span>Request access</span>
            <span className="text-[#ff4000] transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">{"→"}</span>
          </span>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-md bg-[#ff4000] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </a>
      </div>
    </section>
  );
}

function UserAppsSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-8 fade-in-up">
      <UserApps />
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-16 fade-in-up">
      <div className="h-px w-full bg-[rgba(229,224,214,0.08)]" />
      <div className="mt-6 flex items-center justify-between text-base text-[#8E8B85]">
        <span>© {new Date().getFullYear()} Muffin</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[#ff4000] transition-all duration-200 hover:-translate-y-0.5">
            Docs
          </a>
          <a href="#" className="hover:text-[#ff4000] transition-all duration-200 hover:-translate-y-0.5">
            GitHub
          </a>
          <a href="#" className="hover:text-[#ff4000] transition-all duration-200 hover:-translate-y-0.5">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

function Examples({ setPrompt }: { setPrompt: (text: string) => void }) {
  return (
    <div className="mt-8 space-y-4 fade-in-up stagger-4">
      <p className="text-[#8E8B85] text-sm">Try these examples:</p>
      <div className="flex flex-wrap gap-2">
        <div className="fade-in-up stagger-1">
          <ExampleButton
            text="Dog Food App"
            promptText="Build a dog food marketplace where users can browse and purchase premium dog food."
            onClick={(text) => {
              setPrompt(text);
            }}
          />
        </div>
        <div className="fade-in-up stagger-2">
          <ExampleButton
            text="Personal Portfolio"
            promptText="Create a personal website with portfolio, blog, and contact sections."
            onClick={(text) => {
              setPrompt(text);
            }}
          />
        </div>
        <div className="fade-in-up stagger-3">
          <ExampleButton
            text="Burrito SaaS"
            promptText="Build a B2B SaaS for burrito shops to manage inventory, orders, and delivery logistics."
            onClick={(text) => {
              setPrompt(text);
            }}
          />
        </div>
      </div>
    </div>
  );
}
