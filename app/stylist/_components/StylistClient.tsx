"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, User, Send, Paperclip, Plus, CheckCircle2 } from "lucide-react";
import { type Product, PRODUCTS } from "@/lib/products";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  products?: Product[];
  sizeSelectorProduct?: Product | null;
}

interface ChatSession {
  id: string;
  title: string;
  time: string;
  messages: Message[];
}

export function StylistClient() {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Default products for the initial Parisian session
  const defaultParisianProducts = PRODUCTS.filter((p) =>
    [6, 7, 12, 5].includes(p.id)
  );

  // Chat sessions database
  const [sessions, setSessions] = React.useState<ChatSession[]>([
    {
      id: "chic-parisian",
      title: "Chic Parisian Evening",
      time: "Today, 2:45 PM",
      messages: [
        {
          id: "m1",
          sender: "ai",
          text: "Bonjour! I've curated a few Parisian-inspired looks for your evening gala. How do these silhouettes feel to you?"
        },
        {
          id: "m2",
          sender: "user",
          text: "I love the structured look of the second one. What sizes are available for the blazer?"
        },
        {
          id: "m3",
          sender: "ai",
          text: "Excellent choice. The Structured Blazer is available in several sizes. Here are my top styling recommendations to complete that look:",
          products: defaultParisianProducts,
          sizeSelectorProduct: PRODUCTS.find((p) => p.id === 6) // Structured Blazer
        }
      ]
    },
    {
      id: "sustainable-summer",
      title: "Sustainable Summer Capsule",
      time: "Yesterday, 10:15 AM",
      messages: [
        {
          id: "ss-1",
          sender: "ai",
          text: "Hello! For your organic summer capsule, I highly recommend breathable linen fabrics and earthy sand tones. Check out this relaxed styling base:"
        },
        {
          id: "ss-2",
          sender: "user",
          text: "Do you have linen shirts or suede loaders?"
        },
        {
          id: "ss-3",
          sender: "ai",
          text: "Yes, our Relaxed Linen Shirt and Suede Loafers represent the perfect combination of summer slow-fashion and premium comfort:",
          products: PRODUCTS.filter((p) => [1, 8, 2].includes(p.id))
        }
      ]
    },
    {
      id: "minimalist-office",
      title: "Minimalist Office Wear",
      time: "Oct 24, 2023",
      messages: [
        {
          id: "mo-1",
          sender: "ai",
          text: "Let's build a timeless office wardrobe. Modern professional codes rely on premium materials and comfortable structures. Here are my key recommendations:"
        },
        {
          id: "mo-2",
          sender: "user",
          text: "Show me suits, blazers, and totes"
        },
        {
          id: "mo-3",
          sender: "ai",
          text: "I recommend our Italian wool blazer paired with our structured leather tote for a sophisticated workspace profile:",
          products: PRODUCTS.filter((p) => [6, 7, 12].includes(p.id))
        }
      ]
    },
    {
      id: "weekend-aspen",
      title: "Weekend Getaway: Aspen",
      time: "Oct 20, 2023",
      messages: [
        {
          id: "wa-1",
          sender: "ai",
          text: "Welcome back! For Aspen's cold-weather escape, we want high-end layering. Cashmere knitwear and heavy double-breasted overcoats are absolute essentials:"
        },
        {
          id: "wa-2",
          sender: "user",
          text: "Do you have cashmere sweaters and heavy wool coats?"
        },
        {
          id: "wa-3",
          sender: "ai",
          text: "Here is our luxury cashmere sweater, belted coat, and structured overcoat mix to provide pristine warmth:",
          products: PRODUCTS.filter((p) => [3, 4, 10].includes(p.id))
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = React.useState<string>("chic-parisian");
  const [chatInput, setChatInput] = React.useState<string>("");
  const [isThinking, setIsThinking] = React.useState<boolean>(false);

  // Sizing interaction state
  const [sizePickerState, setSizePickerState] = React.useState<{ [key: string]: string }>({
    "6": "M" // default sizing for Structured Blazer
  });
  const [isReserved, setIsReserved] = React.useState<{ [key: string]: boolean }>({});

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]!;

  // Autoscroll chat stream
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeSession.messages, isThinking]);

  const handleSessionChange = (id: string) => {
    setActiveSessionId(id);
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSess: ChatSession = {
      id: newId,
      title: "New Styling Session",
      time: "Just now",
      messages: [
        {
          id: "init",
          sender: "ai",
          text: "Hello! I am your Vistra AI Fashion Stylist. Tell me what mood, occasion, or fabrics you are looking for today, and I will instantly retrieve and coordinate the perfect wardrobe elements for you!"
        }
      ]
    };

    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newId);
  };

  const handleSizeClick = (productId: number, size: string) => {
    setSizePickerState((prev) => ({
      ...prev,
      [productId.toString()]: size
    }));
  };

  const handleReserveSize = (productId: number, title: string) => {
    const sz = sizePickerState[productId.toString()] || "M";
    setIsReserved((prev) => ({
      ...prev,
      [productId.toString()]: true
    }));
    alert(`Success! Size ${sz} of "${title}" has been reserved in your Vistra dressing room!`);
  };

  // Keyword-matching semantic fashion search recommender
  const getSemanticResponse = (query: string): { text: string; products?: Product[] } => {
    const lower = query.toLowerCase();

    // 1. Silk products search query
    if (lower.includes("silk")) {
      const matched = PRODUCTS.filter((p) =>
        p.material.toLowerCase().includes("silk")
      );
      return {
        text: "I've retrieved our premium mulberry silk options. These lightweight, bias-cut garments represent the height of luxury shine and fluid drape:",
        products: matched
      };
    }

    // 2. Linen garments
    if (lower.includes("linen")) {
      const matched = PRODUCTS.filter((p) =>
        p.material.toLowerCase().includes("linen")
      );
      return {
        text: "Here is our organic linen collection. Breathable weaves, relaxed tailoring, and neutral earth shades designed for seaside ease and slow summer living:",
        products: matched
      };
    }

    // 3. Cashmere knitwear
    if (lower.includes("cashmere") || lower.includes("knit") || lower.includes("sweater")) {
      const matched = PRODUCTS.filter((p) =>
        p.material.toLowerCase().includes("cashmere") ||
        p.category.toLowerCase().includes("knitwear")
      );
      return {
        text: "I have gathered our Grade-A Mongolian cashmere and fine merino wool knits. Exceptionally soft, lightweight, and offering warm structural layering:",
        products: matched
      };
    }

    // 4. Black tones
    if (lower.includes("black") || lower.includes("dark")) {
      const matched = PRODUCTS.filter((p) => p.color === "black");
      return {
        text: "I've assembled our pristine charcoal and black elements. Impeccable tailoring, midnight tones, and strong silhouettes for a commanding look:",
        products: matched
      };
    }

    // 5. Tan/beige colors
    if (lower.includes("tan") || lower.includes("beige") || lower.includes("sand") || lower.includes("brown")) {
      const matched = PRODUCTS.filter((p) => p.color === "tan");
      return {
        text: "These are our refined warm-neutral earth tones. Sand beige, rich tan suede, and elegant camel blends for high-end styling warmth:",
        products: matched
      };
    }

    // 6. White/Cream/Ecru
    if (lower.includes("white") || lower.includes("cream") || lower.includes("ecru") || lower.includes("light")) {
      const matched = PRODUCTS.filter((p) => p.color === "white");
      return {
        text: "I've sourced our crisp cream, ivory, and white collection. Clean, minimal styles crafted from fine cottons, silks, and GOTS-certified linens:",
        products: matched
      };
    }

    // 7. Suits / Trousers / Blazers
    if (lower.includes("suit") || lower.includes("trouser") || lower.includes("pant") || lower.includes("blazer") || lower.includes("office")) {
      const matched = PRODUCTS.filter((p) =>
        p.category.toLowerCase().includes("suit") ||
        p.title.toLowerCase().includes("trouser") ||
        p.title.toLowerCase().includes("chinos")
      );
      return {
        text: "Here is our tailored collection. Structured shoulders, sharp creases, and clean draping to deliver unmatched professional elegance:",
        products: matched
      };
    }

    // 8. Gala / Formal / Evening
    if (lower.includes("gala") || lower.includes("formal") || lower.includes("evening") || lower.includes("dress")) {
      const matched = PRODUCTS.filter((p) => p.occasion === "Formal");
      return {
        text: "I've curated these high-end formal choices for an unforgettable evening. Fine silk midi dresses, belted cashmere coats, and luxurious overcoats:",
        products: matched
      };
    }

    // 9. Casual / Seaside / Coastal
    if (lower.includes("casual") || lower.includes("coast") || lower.includes("relax")) {
      const matched = PRODUCTS.filter((p) => p.occasion === "Casual");
      return {
        text: "These represent our relaxed, slow-fashion off-duty designs. Soft knits, organic cotton chinos, lightweight linen shirts, and flexible suede loafers:",
        products: matched
      };
    }

    // 10. Fallback advice
    return {
      text: `That is an interesting styling path! To build a complete outfit, I've selected a few of Vistra's most versatile, quiet luxury foundations. How would you like to style these?`,
      products: PRODUCTS.slice(0, 3)
    };
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim()
    };

    // Update session stream with user bubble
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id === activeSessionId) {
          return {
            ...sess,
            messages: [...sess.messages, userMsg]
          };
        }
        return sess;
      })
    );

    setIsThinking(true);

    // Dynamic search engine simulation response
    setTimeout(() => {
      const semanticResult = getSemanticResponse(text);
      
      // Determine if we should also add a nested size picker for the matched first product
      let sizeSelectorProduct: Product | null = null;
      if (semanticResult.products && semanticResult.products.length > 0) {
        sizeSelectorProduct = semanticResult.products[0] || null;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: semanticResult.text,
        products: semanticResult.products,
        sizeSelectorProduct
      };

      setIsThinking(false);
      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.id === activeSessionId) {
            return {
              ...sess,
              messages: [...sess.messages, aiMsg]
            };
          }
          return sess;
        })
      );
    }, 1800);
  };

  const handleProductCardClick = (id: number) => {
    window.location.href = `/product/${id}`;
  };

  return (
    <div className="flex flex-1 w-full h-full relative overflow-hidden select-none">
      
      {/* Left Sidebar: Chat History (320px) */}
      <aside className="hidden lg:flex lg:w-[320px] bg-surface-container-low border-r border-surface-container flex-col overflow-y-auto hide-scrollbar z-10 shrink-0">
        <div className="p-lg border-b border-surface-container">
          <h2 className="text-headline-md font-headline-md text-charcoal select-none">Chat Sessions</h2>
        </div>
        <div className="flex flex-col">
          {sessions.map((sess) => (
            <button
              key={sess.id}
              onClick={() => handleSessionChange(sess.id)}
              className={`flex flex-col gap-xs p-lg transition-all duration-200 text-left border-r-4 border-l-4 border-l-transparent cursor-pointer ${
                activeSessionId === sess.id
                  ? "bg-white border-r-primary font-bold text-neutral-900"
                  : "hover:bg-neutral-200/50 border-r-transparent text-secondary"
              }`}
            >
              <span className="text-sm font-semibold select-none">{sess.title}</span>
              <span className="text-[10px] font-bold text-muted tracking-wide uppercase select-none">{sess.time}</span>
            </button>
          ))}
        </div>
        
        {/* Create new styling session button */}
        <div className="mt-auto p-lg select-none">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-sm py-3 border-2 border-dashed border-outline-variant hover:border-brand rounded-xl text-xs font-bold text-charcoal hover:text-brand bg-white transition-all cursor-pointer hover:shadow-sm active:scale-98"
          >
            <Plus className="h-4 w-4" />
            New Styling Session
          </button>
        </div>
      </aside>

      {/* Right Column: Dynamic Interactive Stylist Chat Board */}
      <section className="flex-1 flex flex-col bg-background relative h-full min-w-0">
        
        {/* Chat Message Flow Stream */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-margin-mobile md:px-xl py-xl flex flex-col gap-lg pb-[200px] hide-scrollbar"
        >
          {activeSession.messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-md">
              {msg.sender === "ai" ? (
                /* AI Message: Group avatar on the left, and a single vertical column on the right */
                <div className="flex gap-md items-start w-full max-w-[85%] lg:max-w-[70%] mr-auto">
                  {/* AI Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shadow-primary/15 shrink-0 select-none">
                    <Sparkles className="h-4 w-4 fill-white/10 text-white" />
                  </div>

                  {/* Right column containing text bubble, carousel, and size picker */}
                  <div className="flex flex-col gap-md w-full flex-1 min-w-0">
                    {/* Text bubble */}
                    <div className="bg-white border border-surface-container p-md rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed font-semibold tracking-tight text-secondary max-w-[85%] lg:max-w-[70%] select-none">
                      <p>{msg.text}</p>
                    </div>

                    {/* Dynamic Product Carousel (If recommended) */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="flex gap-md overflow-x-auto hide-scrollbar pb-xs -mx-2 px-2 w-full max-w-full">
                        {msg.products.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => handleProductCardClick(prod.id)}
                            className="flex-shrink-0 w-[220px] bg-white rounded-xl overflow-hidden border border-surface-container shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex flex-col"
                          >
                            <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container relative">
                              <Image
                                alt={prod.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                                src={prod.image}
                                fill
                                sizes="220px"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/95 px-lg py-sm rounded-full text-[10px] font-bold tracking-wider shadow-md">
                                  View Details
                                </span>
                              </div>
                            </div>
                            <div className="p-md flex flex-col gap-xs select-none">
                              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                                {prod.material}
                              </span>
                              <h3 className="text-xs font-bold text-on-surface truncate group-hover:text-brand transition-colors">
                                {prod.title}
                              </h3>
                              <p className="text-xs font-extrabold text-brand">${prod.price}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductCardClick(prod.id);
                                }}
                                className="mt-sm w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-outline-variant text-[10px] font-bold rounded-lg hover:border-neutral-850 transition-colors cursor-pointer"
                              >
                                Select Size
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Nested Size Picker Dialog Box */}
                    {msg.sizeSelectorProduct && (
                      <div className="w-full max-w-sm min-w-[280px] sm:min-w-[340px] border border-error-container bg-gradient-to-br from-white to-primary-light-bg p-lg rounded-xl shadow-md ai-gradient-border relative select-none flex-shrink-0">
                        <div className="flex items-center gap-sm mb-md">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-xs font-extrabold text-neutral-900 tracking-tight">
                            {msg.sizeSelectorProduct.title}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-secondary leading-relaxed mb-md">
                          Please select your size for the fitting session.
                        </p>

                        {isReserved[msg.sizeSelectorProduct.id.toString()] ? (
                          <div className="py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Size {sizePickerState[msg.sizeSelectorProduct.id.toString()] || "M"} successfully reserved!
                          </div>
                        ) : (
                          <div className="flex flex-col gap-md">
                            <div className="flex gap-sm">
                              {["S", "M", "L"].map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => handleSizeClick(msg.sizeSelectorProduct!.id, sz)}
                                  className={`flex-1 py-2.5 border rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                    (sizePickerState[msg.sizeSelectorProduct!.id.toString()] || "M") === sz
                                      ? "bg-primary-fixed text-primary border-primary-fixed-dim"
                                      : "bg-white text-on-surface border-surface-container hover:bg-neutral-50"
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleReserveSize(msg.sizeSelectorProduct!.id, msg.sizeSelectorProduct!.title)
                              }
                              className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-sm shadow-primary/20 border-none cursor-pointer text-center"
                            >
                              Reserve styling options
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* User Message: Avatar on the right, content on the left */
                <div className="flex gap-md items-start max-w-[85%] lg:max-w-[70%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant text-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm shrink-0 select-none">
                    <User className="h-4 w-4 text-charcoal" />
                  </div>
                  <div className="p-md rounded-2xl shadow-sm text-xs leading-relaxed font-semibold tracking-tight border bg-neutral-900 border-neutral-900 text-white rounded-tr-none select-none">
                    <p>{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Vistra is styling typing indicator bubble */}
          {isThinking && (
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
        </div>

        {/* Bottom Floating Chat input footer block */}
        <div className="absolute bottom-0 w-full p-lg bg-gradient-to-t from-background via-background/95 to-transparent pt-10 select-none">
          <div className="max-w-4xl mx-auto flex flex-col gap-md">
            
            {/* Horizontal suggested queries pills */}
            <div className="flex gap-sm overflow-x-auto hide-scrollbar px-2">
              {[
                "Find similar styles in silk",
                "Reserve comfortable summer capsule",
                "Complete this outfit for a gala",
                "Recommend suits for office wear"
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(pill)}
                  className="flex-shrink-0 px-4 py-2 bg-white border border-surface-container hover:border-brand rounded-full text-xs font-semibold text-charcoal hover:text-brand transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Main Chat Input Control */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
                setChatInput("");
              }}
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
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask our AI Stylist..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-semibold text-charcoal placeholder:text-secondary/40 h-10 pr-2 focus:outline-none"
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

      {/* Embedded Typing animation indicators */}
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
      `}</style>
    </div>
  );
}
