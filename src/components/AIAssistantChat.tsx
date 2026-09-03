import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ShoppingCart,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../products.ts';
import { Product } from '../types.ts';
import { generateLocalChatReply } from '../utils/aiChatClient.ts';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedProducts?: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    badge?: string;
  }>;
  showAdminWhatsApp?: boolean;
}

const QUICK_PROMPTS = [
  { label: '💼 ¿Cuál Office me conviene?', prompt: '¿Cuál es la diferencia entre Office 2024, 2021 y Microsoft 365? ¿Cuál me recomiendas?' },
  { label: '💻 ¿Windows 11 o Windows 10?', prompt: '¿Qué versión de Windows me recomiendas entre Windows 11 Pro y Windows 10 Pro?' },
  { label: '⚡ ¿Cómo es la entrega y activación?', prompt: '¿Cómo es el proceso de entrega de la licencia y cómo se activa en mi computadora?' },
  { label: '🎁 Cupones y Descuentos', prompt: '¿Qué descuentos o cupones de promoción tienen disponibles hoy en UpClic?' },
  { label: '👨‍💻 Hablar con Administrador', prompt: 'Deseo comunicarme directamente con el administrador por WhatsApp para una consulta.' },
];

export const AIAssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);

  const { navigateToProduct, addItem } = useCart();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        content: `¡Hola! 👋 Soy tu **Asistente Virtual de UpClic**.\n\nEstoy aquí para resolver todas tus dudas sobre nuestras licencias originales de **Microsoft Office, Windows, Visio y Project**, ayudarte con el proceso de activación o recomendarte la mejor opción según tu computadora.\n\n¿En qué te puedo ayudar hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadNotice(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageText,
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let data: any = null;

      try {
        // Attempt backend endpoint first (works on FullStack servers / Cloud Run)
        const historyPayload = messages
          .filter((m) => m.id !== 'msg-welcome')
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            history: historyPayload,
          }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        // Network error / static GitHub Pages hosting
        console.warn('Backend /api/chat not reachable, using client-side AI knowledge base:', fetchErr);
      }

      // If backend is not present (e.g. static hosting on GitHub Pages), use the rich client-side knowledge engine
      if (!data || !data.reply) {
        data = generateLocalChatReply(messageText);
      }

      const replyContent =
        data.reply ||
        `¡Hola! Para consultas personalizadas o soporte técnico rápido, puedes contactar directamente a nuestro Administrador por WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`;

      const checkAdminInReply = Boolean(data.showAdminWhatsApp);

      const newBotMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: data.suggestedProducts || [],
        showAdminWhatsApp: checkAdminInReply,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      console.error('Error in chat request:', err);
      const localFallback = generateLocalChatReply(messageText);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        content: localFallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: localFallback.suggestedProducts || [],
        showAdminWhatsApp: Boolean(localFallback.showAdminWhatsApp),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'model',
        content: `¡Chat reiniciado! 😊 Soy tu **Asistente Virtual de UpClic**. ¿Qué duda o producto deseas consultar hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleProductClick = (slug: string) => {
    navigateToProduct(slug);
    setIsOpen(false);
  };

  const handleAddToCart = (productSlug: string) => {
    const fullProduct = products.find((p) => p.slug === productSlug || p.id === productSlug);
    if (fullProduct) {
      addItem(fullProduct);
    }
  };

  // Helper to format text with bold, markdown links and line breaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Parse markdown bold **text** and [link text](url)
      const parts = [];
      let lastIndex = 0;
      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        const matchedText = match[0];
        if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
          parts.push(
            <strong key={`${lineIndex}-${match.index}`} className="font-bold text-slate-900">
              {matchedText.slice(2, -2)}
            </strong>
          );
        } else if (matchedText.startsWith('[') && matchedText.includes('](')) {
          const titleMatch = matchedText.match(/\[(.*?)\]/);
          const urlMatch = matchedText.match(/\((.*?)\)/);
          const linkTitle = titleMatch ? titleMatch[1] : 'Enlace';
          const linkUrl = urlMatch ? urlMatch[1] : '#';

          const isInternalProduct = linkUrl.startsWith('/producto/');
          const isWhatsApp = linkUrl.includes('wa.me') || linkUrl.includes('whatsapp');

          if (isInternalProduct) {
            const slug = linkUrl.replace('/producto/', '');
            parts.push(
              <button
                key={`${lineIndex}-${match.index}`}
                type="button"
                onClick={() => handleProductClick(slug)}
                className="inline-flex items-center gap-1 font-bold text-[#0066FF] hover:underline cursor-pointer"
              >
                <span>{linkTitle}</span>
                <ExternalLink className="w-3 h-3 inline" />
              </button>
            );
          } else {
            parts.push(
              <a
                key={`${lineIndex}-${match.index}`}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-bold ${
                  isWhatsApp ? 'text-[#25D366] hover:text-[#20bd5a]' : 'text-[#0066FF]'
                } underline`}
              >
                <span>{linkTitle}</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            );
          }
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <React.Fragment key={lineIndex}>
          <span>{parts.length > 0 ? parts : line}</span>
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
        {/* Unread banner message tooltip when chat is closed */}
        {!isOpen && hasUnreadNotice && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2.5 bg-white py-2 px-3.5 rounded-2xl border border-blue-200/80 shadow-lg cursor-pointer hover:border-blue-400 transition-all transform hover:-translate-y-0.5 animate-bounce"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Asistente Virtual UpClic
              </p>
              <p className="text-[11px] text-slate-500">¿Dudas o soporte con tu licencia? ¡Escríbeme!</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadNotice(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          id="btn-open-ai-chat"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full font-extrabold text-sm shadow-xl transition-all duration-200 cursor-pointer ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 text-white'
              : 'bg-gradient-to-r from-[#0066FF] to-[#0052cc] hover:from-[#0052cc] hover:to-[#003d99] text-white hover:shadow-2xl hover:scale-105 active:scale-95'
          }`}
          aria-label={isOpen ? 'Cerrar Asistente UpClic' : 'Abrir Asistente UpClic'}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span>Cerrar Chat</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0066FF] rounded-full" />
              </div>
              <span className="font-bold">Asistente UpClic</span>
              <span className="bg-white/20 text-[11px] py-0.5 px-2 rounded-full font-semibold hidden sm:inline">
                Online
              </span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Chat Dialog Window */}
      {isOpen && (
        <div
          id="ai-assistant-modal"
          className="fixed bottom-32 sm:bottom-22 right-2 sm:right-6 z-40 w-[calc(100vw-16px)] sm:w-[410px] max-w-[430px] h-[550px] max-h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-[#0a2540] to-blue-950 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center font-black shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    Asistente UpClic
                  </h3>
                  <span className="bg-blue-500/30 text-blue-200 text-[10px] px-1.5 py-0.2 rounded-md font-semibold border border-blue-400/20">
                    AI Soporte
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En línea • Respuestas al instante
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reiniciar conversación"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                aria-label="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimizar ventana"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Sub-bar */}
          <div className="bg-blue-50/80 px-3.5 py-1.5 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Soporte oficial de licencias Microsoft
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#25D366] hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 fill-[#25D366]" />
              WhatsApp Admin
            </a>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/60 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#0066FF] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{renderFormattedText(msg.content)}</div>

                  {/* Inline Suggested Products Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Productos recomendados:
                      </p>
                      {msg.suggestedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 hover:bg-blue-50/50 transition-colors"
                        >
                          <div
                            onClick={() => handleProductClick(p.slug)}
                            className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                          >
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-9 h-9 object-contain bg-white rounded-lg p-0.5 border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-[11px] truncate">
                                {p.name}
                              </h4>
                              <p className="text-[#0066FF] font-black text-xs">
                                S/ {p.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(p.slug)}
                              title="Añadir al carrito"
                              className="p-1.5 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052cc] transition-colors cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProductClick(p.slug)}
                              className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                              title="Ver ficha técnica"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp Admin Escalation Box */}
                  {msg.showAdminWhatsApp && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          'Hola Administrador de UpClic, solicito asistencia con una consulta desde la tienda web.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Abrir WhatsApp del Administrador</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white p-3 rounded-2xl rounded-bl-xs border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    Asistente UpClic está respondiendo...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((qp, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0066FF] hover:border-blue-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta sobre Office, Windows..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs px-3.5 py-2.5 rounded-2xl border border-transparent focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-2xl bg-[#0066FF] hover:bg-[#0052cc] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
