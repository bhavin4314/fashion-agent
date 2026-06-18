"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, User, Send, Plus, X } from "lucide-react";
import { type Product } from "@/lib/products";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { toast } from "react-hot-toast";

function renderItalics(text: string): React.ReactNode {
  const italicParts = text.split(/(\*.*?\*|_.*?_)/g);
  return italicParts.map((italicPart, iIdx) => {
    if (
      (italicPart.startsWith("*") && italicPart.endsWith("*")) ||
      (italicPart.startsWith("_") && italicPart.endsWith("_"))
    ) {
      return (
        <em key={iIdx} className="italic font-medium">
          {italicPart.slice(1, -1)}
        </em>
      );
    }
    return italicPart;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return "";
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((boldPart, bIdx) => {
    if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
      const cleanBold = boldPart.slice(2, -2);
      return (
        <strong key={bIdx} className="font-extrabold text-charcoal">
          {renderItalics(cleanBold)}
        </strong>
      );
    }
    return <React.Fragment key={bIdx}>{renderItalics(boldPart)}</React.Fragment>;
  });
}

export function StylistClient() {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Initial greeting message from the AI Stylist
  const initialMessages = React.useMemo<UIMessage[]>(() => [
    {
      id: "init",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Hello! I am your Vistra AI Fashion Stylist. Tell me what mood, occasion, or fabrics you are looking for today, and I will instantly retrieve and coordinate the perfect wardrobe elements for you!"
        }
      ]
    }
  ], []);

  // Initialize Vercel AI SDK useChat
  const { messages, sendMessage, status, error } = useChat({
    messages: initialMessages,
    onError: (err) => {
      toast.error(err.message || "Failed to connect to the Vistra AI styling service. Please try again.", {
        position: "top-center",
      });
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Autoscroll chat stream
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendChip = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-1 w-full h-full relative overflow-hidden select-none">
      
      {/* Left Column: Dynamic Interactive Stylist Chat Board */}
      <section className={`flex-1 flex flex-col bg-background relative h-full min-w-0 transition-all duration-300 ${selectedProduct ? "lg:border-r border-surface-container" : ""}`}>
        
        {/* Chat Message Flow Stream */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-margin-mobile md:px-xl py-xl flex flex-col gap-lg pb-[200px] hide-scrollbar"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-md">
              {msg.role !== "user" ? (
                /* AI Message: Group avatar on the left, and a single vertical column on the right */
                <div className="flex gap-md items-start w-full max-w-[85%] lg:max-w-[70%] mr-auto">
                  {/* AI Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shadow-primary/15 shrink-0 select-none">
                    <Sparkles className="h-4 w-4 fill-white/10 text-white" />
                  </div>

                  {/* Right column containing text bubble and carousel */}
                  <div className="flex flex-col gap-md w-full flex-1 min-w-0">
                    {/* Render message parts in order */}
                    {(() => {
                      const hasToolParts = msg.parts.some((p) => (p.type as string).startsWith("tool-"));
                      const textParts = msg.parts.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text");
                      const lastTextIndex = hasToolParts && textParts.length > 1
                        ? msg.parts.lastIndexOf(textParts[textParts.length - 1]!)
                        : -1;

                      return msg.parts.map((part, index: number) => {
                        if (part.type === "text") {
                          // If tool parts exist and there are multiple text parts, only show the last one
                          if (lastTextIndex !== -1 && index !== lastTextIndex) {
                            return null;
                          }
                          return (
                            <div key={index} className="bg-white border border-surface-container p-md rounded-2xl rounded-tl-none shadow-sm text-base leading-relaxed font-semibold tracking-tight text-secondary max-w-[85%] lg:max-w-[70%] select-none">
                              <p className="whitespace-pre-wrap">{renderMarkdown(part.text)}</p>
                            </div>
                          );
                        }

                      if (part.type === "tool-searchInventory") {
                        // Only render the last searchInventory tool call part in the message to avoid duplicates
                        const searchParts = msg.parts.filter((p) => p.type === "tool-searchInventory");
                        if (part !== searchParts[searchParts.length - 1]) {
                          return null;
                        }

                        const toolPart = part as unknown as {
                          state: string;
                          output?: unknown;
                          toolCallId: string;
                        };
                        if (toolPart.state === "output-available") {
                          const products = toolPart.output as Product[];
                          if (!products || products.length === 0) {
                            return null;
                          }

                          return (
                            <div key={toolPart.toolCallId} className="flex gap-md overflow-x-auto hide-scrollbar pb-xs -mx-2 px-2 w-full max-w-full">
                              {products.map((prod) => (
                                <div
                                  key={prod.id}
                                  onClick={() => setSelectedProduct(prod)}
                                  className="flex-shrink-0 w-[260px] min-w-[260px] bg-white rounded-xl overflow-hidden border border-surface-container shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex flex-col"
                                >
                                  <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container relative">
                                    <Image
                                      alt={prod.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                                      src={prod.image}
                                      fill
                                      sizes="260px"
                                      unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="bg-white/95 px-lg py-sm rounded-full text-[10px] font-bold tracking-wider shadow-md">
                                        Inspect Item
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-md flex flex-col gap-xs select-none overflow-hidden">
                                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider truncate">
                                      {prod.material}
                                    </span>
                                    <h3 className="text-sm font-bold text-on-surface line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                                      {prod.title}
                                    </h3>
                                    <p className="text-sm font-extrabold text-brand">₹{prod.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          // input-streaming or input-available (loading)
                          return (
                            <div key={toolPart.toolCallId} className="flex gap-sm items-center text-xs text-muted font-bold tracking-wider uppercase select-none animate-pulse">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              Checking Vistra inventory...
                            </div>
                          );
                        }
                      }

                      return null;
                    });
                    })()}
                  </div>
                </div>
              ) : (
                /* User Message: Avatar on the right, content on the left */
                <div className="flex gap-md items-start max-w-[85%] lg:max-w-[70%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant text-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shrink-0 select-none">
                    <User className="h-4 w-4 text-charcoal" />
                  </div>
                  <div className="p-md rounded-2xl shadow-sm text-base leading-relaxed font-semibold tracking-tight border bg-neutral-900 border-neutral-900 text-white rounded-tr-none select-none">
                    <p>
                      {renderMarkdown(
                        msg.parts
                          .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
                          .map((p) => p.text)
                          .join("")
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Vistra is styling typing indicator bubble */}
          {isLoading && !messages[messages.length - 1]?.parts.some((p) => (p.type as string).startsWith("tool-")) && (
            <div className="flex gap-md items-start max-w-[85%] lg:max-w-[70%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm select-none">
                <Sparkles className="h-4 w-4 fill-white/10 text-white" />
              </div>
              <div className="bg-white border border-surface-container p-md px-6 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center border-l-4 border-l-primary">
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
                <span className="ml-2 text-[10px] text-secondary font-bold uppercase tracking-wider select-none">
                  Vistra is styling...
                </span>
              </div>
            </div>
          )}

          {/* Friendly Connection/Service Error Alert Bubble */}
          {error && (
            <div className="flex gap-md items-start max-w-[85%] lg:max-w-[70%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm select-none">
                <Sparkles className="h-4 w-4 text-red-600 animate-pulse" />
              </div>
              <div className="bg-white border border-red-200 p-md rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed font-semibold tracking-tight text-red-700 border-l-4 border-l-red-600 select-none">
                <p>Sorry, I encountered an issue connecting to the styling service. Please check your connection or try again.</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Chat input footer block */}
        <div className="absolute bottom-0 w-full p-lg bg-gradient-to-t from-background via-background/95 to-transparent pt-10 select-none">
          <div className="max-w-4xl mx-auto flex flex-col gap-md">
            
            {/* Horizontal suggested queries pills */}
            <div className="flex flex-wrap gap-sm justify-center px-2">
              {[
                "Find similar styles in silk under 300",
                "Recommend comfortable summer shirts",
                "Complete this outfit for a gala under 400"
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChip(pill)}
                  className="px-4 py-2 bg-white border border-surface-container hover:border-brand rounded-full text-xs font-semibold text-charcoal hover:text-brand transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Main Chat Input Control */}
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-md bg-white border border-surface-container p-sm pl-md rounded-full shadow-xl"
            >
              <button
                type="button"
                onClick={() => alert("Upload media currently verified in administrative side.")}
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center p-2 border-none bg-transparent cursor-pointer shrink-0"
              >
                <Plus className="h-5 w-5" />
              </button>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask our AI Stylist..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-base font-semibold text-charcoal placeholder:text-secondary/40 h-10 pr-2 focus:outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:brightness-110 active:scale-90 transition-all shadow-md shadow-primary/25 border-none cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </form>

            <div className="text-center select-none pb-xs">
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest">
                Powered by Vistra Concierge AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Dynamic Side-by-Side Product Detail Inspector */}
      {selectedProduct && (
        <aside className="absolute lg:relative inset-y-0 right-0 w-full sm:w-[400px] lg:w-[450px] bg-white border-l border-surface-container flex flex-col h-full overflow-y-auto shrink-0 z-30 shadow-2xl lg:shadow-none animate-slide-in">
          {/* Header */}
          <div className="p-lg border-b border-surface-container flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-headline-md font-headline-md text-charcoal truncate">Garment Details</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 hover:bg-neutral-100 rounded-full text-secondary hover:text-charcoal cursor-pointer border-none bg-transparent"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Content */}
          <div className="p-lg flex flex-col gap-lg select-none">
            {/* Product Image */}
            <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl bg-surface-container shadow-inner">
              <Image
                alt={selectedProduct.title}
                src={selectedProduct.image}
                fill
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            {/* Title, Category & Price */}
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                {selectedProduct.category} • {selectedProduct.material}
              </span>
              <h1 className="text-headline-lg font-headline-lg text-charcoal">
                {selectedProduct.title}
              </h1>
              <p className="text-lg font-extrabold text-brand mt-xs">₹{selectedProduct.price}</p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-sm border-t border-surface-container pt-md">
              <h3 className="text-xs font-bold uppercase text-charcoal tracking-wide">Description</h3>
              <p className="text-xs text-secondary leading-relaxed font-semibold">
                {selectedProduct.description}
              </p>
            </div>

            {/* AI Recommendation */}
            <div className="bg-primary-light-bg border border-outline-variant p-md rounded-xl flex flex-col gap-xs relative">
              <div className="flex items-center gap-xs text-[10px] font-bold text-primary uppercase tracking-wider">
                <Sparkles className="h-3 w-3 fill-primary/10" />
                AI Stylist recommendation
              </div>
              <p className="text-xs text-secondary italic font-semibold leading-relaxed">
                {selectedProduct.aiRecommendation || `Matches beautifully with your selected aesthetics.`}
              </p>
            </div>

            {/* Action Button: View Full Details Page */}
            <div className="mt-md pt-lg border-t border-surface-container">
              <Link
                href={`/product/${selectedProduct.id}`}
                className="w-full block py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold text-center no-underline hover:brightness-110 active:scale-[0.98] transition-all shadow-md uppercase tracking-wider"
              >
                View Full Product Page
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Embedded Typing & Transition animations */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .ai-gradient-border::before {
          content: "";
          position: absolute;
           inset: -1px;
           border-radius: 13px;
           padding: 1px;
           background: linear-gradient(to bottom right, var(--color-primary), var(--color-primary-fixed-dim), var(--color-primary));
           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        .typing-dot {
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
