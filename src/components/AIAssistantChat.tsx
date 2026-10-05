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
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Clock,
  Check,
  Compass,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../products.ts';
import { generateLocalChatReply } from '../utils/aiChatClient.ts';

interface SuggestedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  badge?: string;
  category?: string;
  duration?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedProducts?: SuggestedProduct[];
  showAdminWhatsApp?: boolean;
}

// Interactive Needs Scenarios for guided license recommendation
const GUIDED_SCENARIOS_ES = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Estudios / Universidad',
    prompt: 'Soy estudiante universitario y necesito Office para mis tareas, monografías y exposiciones. ¿Cuál versión de Office me recomiendas según mi presupuesto y equipo?',
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Trabajo / Oficina',
    prompt: 'Trabajo desde casa y en oficina usando Word, Excel avanzado y Outlook todo el día. ¿Cuál me conviene entre Office 2024 Pro Plus y Office 2021?',
  },
  {
    id: 'new-pc',
    icon: '💻',
    title: 'PC recién formateada',
    prompt: 'Acabo de comprar o formatear mi computadora y no tiene ni Windows activado ni Office. ¿Tienen algún Combo de ahorro que incluya Windows 11 y Office?',
  },
  {
    id: 'mac',
    icon: '🍎',
    title: 'Tengo Mac (macOS)',
    prompt: 'Tengo una laptop MacBook con macOS. ¿Qué opciones de Office o software compatible tienen para Apple Mac en UpClic?',
  },
  {
    id: 'business',
    icon: '🏢',
    title: 'Empresa / Negocio (RUC)',
    prompt: 'Necesito licencias para mi empresa o negocio con facturación y soporte técnico. ¿Cuáles licencias de Windows y Office me recomiendan para varias PCs?',
  },
  {
    id: 'perpetual',
    icon: '⚡',
    title: 'Permanente sin mensualidades',
    prompt: 'No quiero pagar suscripciones mensuales ni anuales, deseo una licencia de pago único que sea permanente de por vida. ¿Qué opciones tienen?',
  },
];

const GUIDED_SCENARIOS_EN = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Student / University',
    prompt: 'I am a university student and need Office for coursework, essays, and presentations. Which Office version do you recommend for my budget?',
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Work / Office',
    prompt: 'I work remotely and at the office using Word, advanced Excel, and Outlook daily. Which one is best for me between Office 2024 Pro Plus and Office 2021?',
  },
  {
    id: 'new-pc',
    icon: '💻',
    title: 'New or Formatted PC',
    prompt: 'I just built or formatted my PC and need both Windows and Office activated. Do you have a combo package with Windows 11 and Office?',
  },
  {
    id: 'mac',
    icon: '🍎',
    title: 'I have a Mac (macOS)',
    prompt: 'I use a MacBook with Apple macOS. Which Office or design options do you have that are compatible with Mac?',
  },
  {
    id: 'business',
    icon: '🏢',
    title: 'Business / Company',
    prompt: 'I need licenses for my business with official invoices and technical support for multiple computers. What do you recommend?',
  },
  {
    id: 'perpetual',
    icon: '⚡',
    title: 'Perpetual (No Monthly Fees)',
    prompt: 'I do not want monthly or recurring fees. I want a one-time perpetual license for life. What options do you have?',
  },
];

const QUICK_PROMPTS_ES = [
  { label: '🎯 Recomiéndame una licencia', prompt: 'Hola, necesito que me asesores para elegir la mejor licencia de software para mi equipo.' },
  { label: '💼 Office 2024 vs 2021 vs 365', prompt: '¿Cuál es la diferencia entre Office 2024 Pro Plus, Office 2021 y Microsoft 365? ¿Cuál me conviene más?' },
  { label: '💻 Windows 11 Pro vs 10 Pro', prompt: '¿Qué versión de Windows me recomiendas entre Windows 11 Pro y Windows 10 Pro para mi computadora?' },
  { label: '⚡ ¿Cómo es la entrega (10-30 min)?', prompt: '¿Cómo funciona la entrega digital en 10 a 30 minutos y qué recibo exactamente en mi correo y WhatsApp?' },
  { label: '🎁 Cupones y 10% de descuento', prompt: '¿Cómo funciona la promoción del 10% de descuento automático al llevar 2 o más licencias?' },
  { label: '🔑 ¿Diferencia OEM vs Retail?', prompt: '¿Cuál es la diferencia entre una licencia OEM y una Retail, y cuál me conviene adquirir?' },
];

const QUICK_PROMPTS_EN = [
  { label: '🎯 Recommend a license', prompt: 'Hello, please advise me on selecting the best software license for my setup.' },
  { label: '💼 Office 2024 vs 2021 vs 365', prompt: 'What is the difference between Office 2024 Pro Plus, Office 2021, and Microsoft 365? Which do you recommend?' },
  { label: '💻 Windows 11 Pro vs 10 Pro', prompt: 'Which Windows version do you recommend between Windows 11 Pro and Windows 10 Pro?' },
  { label: '⚡ How does 10-30 min delivery work?', prompt: 'How does the 10 to 30 minutes digital delivery work and what do I receive by email and WhatsApp?' },
  { label: '🎁 Coupons & 10% off', prompt: 'How does the automatic 10% discount when buying 2 or more licenses work?' },
  { label: '🔑 OEM vs Retail difference?', prompt: 'What is the difference between OEM and Retail licenses, and which one should I buy?' },
];

export const AIAssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);
  const [showGuidedAdvisor, setShowGuidedAdvisor] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

  // Audio Speech Synthesis state
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);

  const { navigateToProduct, addItem, language, currency, formatPrice } = useCart();

  const isEn = language === 'EN';
  const quickPrompts = isEn ? QUICK_PROMPTS_EN : QUICK_PROMPTS_ES;
  const guidedScenarios = isEn ? GUIDED_SCENARIOS_EN : GUIDED_SCENARIOS_ES;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        content: isEn
          ? `¡Hello! I am your **UpClic AI License Advisor & Support Assistant**. 🤖✨\n\nI am here to guide you in choosing the exact software license for your needs:\n• **Microsoft Office** (2024, 2021, 365 or Mac)\n• **Windows** (11 Pro, 10 Pro or Enterprise)\n• **Money-saving Bundles & Project/Visio**\n\n⚡ **Guaranteed digital delivery:** 10 to 30 minutes by email & WhatsApp.\n🛡️ **Official 6-Month Warranty (Phone: 1 month) & genuine activation.**\n\nHow can I help you today? You can select a quick scenario or type your question below.`
          : `¡Hola! Soy tu **Asesor Inteligente de Licencias y Soporte UpClic**. 🤖✨\n\nEstoy aquí para orientarte a elegir la licencia exacta según tu equipo y necesidades:\n• **Microsoft Office** (2024, 2021, 365 o Mac)\n• **Windows** (11 Pro, 10 Pro o Enterprise)\n• **Combos de Ahorro y Project/Visio**\n\n⚡ **Entrega digital garantizada:** En 10 a 30 minutos a tu correo y WhatsApp.\n🛡️ **Garantía oficial de 6 meses (activación telefónica: 1 mes) y soporte técnico.**\n\n¿En qué puedo ayudarte hoy? Puedes elegir una de las opciones guiadas o escribirme tu consulta.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: [
          {
            id: 'prod-office-2024',
            slug: 'office-2024-pro-plus',
            name: 'Microsoft Office 2024 Professional Plus',
            price: 27,
            oldPrice: 89,
            imageUrl: '/products/office-2024.webp',
            badge: 'Más Vendido',
            category: 'Office',
            duration: 'Permanente',
          },
          {
            id: 'prod-win11-pro',
            slug: 'windows-11-pro-key',
            name: 'Windows 11 Professional Key 32/64 Bit',
            price: 28,
            oldPrice: 85,
            imageUrl: '/products/windows-11-pro.webp',
            badge: 'Popular',
            category: 'Windows',
            duration: 'Permanente',
          },
          {
            id: 'prod-combo-win11-office2024',
            slug: 'combo-windows-11-pro-office-2024-pro-plus',
            name: 'Combo 2 en 1: Windows 11 Pro + Office 2024 Pro Plus',
            price: 45,
            oldPrice: 190,
            imageUrl: '/products/combo-win11-office2024.webp',
            badge: 'Super Ahorro',
            category: 'Combos',
            duration: 'Permanente',
          },
        ],
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

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
    } else {
      // Stop speech synthesis when closing
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
      }
    }
  }, [isOpen, messages, isLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    // Stop speaking if currently speaking
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

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
    setShowGuidedAdvisor(false);

    try {
      let data: any = null;

      try {
        // Send request to server-side Gemini endpoint
        const historyPayload = messages
          .filter((m) => m.id !== 'msg-welcome')
          .slice(-6)
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
            currency: currency || 'PEN',
          }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn('Backend /api/chat not reachable, using intelligent client fallback:', fetchErr);
      }

      // If backend is not available, use rich local fallback
      if (!data || !data.reply) {
        data = generateLocalChatReply(messageText, undefined, language);
      }

      const replyContent =
        data.reply ||
        (isEn
          ? `Hello! For personalized licensing questions, feel free to contact our Administrator directly on WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`
          : `¡Hola! Para consultas personalizadas sobre licencias, puedes contactar directamente a nuestro Administrador por WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`);

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
      const localFallback = generateLocalChatReply(messageText, undefined, language);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'model',
        content: isEn
          ? `¡Chat restarted! I am your **UpClic AI License Advisor**. How can I assist you with your software licenses today?`
          : `¡Chat reiniciado! Soy tu **Asesor Inteligente de Licencias UpClic**. ¿Qué software o producto deseas consultar hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: [
          {
            id: 'prod-office-2024',
            slug: 'office-2024-pro-plus',
            name: 'Microsoft Office 2024 Professional Plus',
            price: 27,
            oldPrice: 89,
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
            badge: 'Más Vendido',
            category: 'Office',
            duration: 'Permanente',
          },
          {
            id: 'prod-combo-win11-office2024',
            slug: 'combo-windows-11-pro-office-2024-pro-plus',
            name: 'Combo 2 en 1: Windows 11 Pro + Office 2024 Pro Plus',
            price: 45,
            oldPrice: 190,
            imageUrl: '/products/combo-win11-office2024.webp',
            badge: 'Super Ahorro',
            category: 'Combos',
            duration: 'Permanente',
          },
        ],
      },
    ]);
  };

  const handleProductClick = (slug: string) => {
    navigateToProduct(slug);
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleAddToCart = (productSlug: string) => {
    const fullProduct = products.find((p) => p.slug === productSlug || p.id === productSlug);
    if (fullProduct) {
      addItem(fullProduct);
      setAddedItemSlug(productSlug);
      setTimeout(() => {
        setAddedItemSlug(null);
      }, 1800);
    }
  };

  // Text-to-Speech playback toggle
  const toggleSpeech = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown formatting for speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[•#]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isEn ? 'en-US' : 'es-ES';
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text Microphone toggle
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isEn
          ? 'Voice recognition is not supported in this browser. Please type your query.'
          : 'El reconocimiento de voz no está soportado en este navegador. Por favor escribe tu consulta.'
      );
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isEn ? 'en-US' : 'es-PE';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Helper to format text with bold, markdown links and line breaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
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
            <strong key={`${lineIndex}-${match.index}`} className="font-bold text-slate-950">
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
      <div className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-[80] flex flex-col items-end gap-2">
        {/* Unread banner message tooltip when chat is closed */}
        {!isOpen && hasUnreadNotice && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-slate-900 to-blue-950 text-white py-2 px-3.5 rounded-full border border-blue-400/40 shadow-xl cursor-pointer hover:border-blue-400 transition-all transform hover:-translate-y-0.5 group animate-in fade-in slide-in-from-bottom-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold tracking-tight text-white group-hover:text-blue-200">
                {isEn ? 'AI License Advisor' : 'Asesor IA • ¿Qué licencia buscas?'}
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isEn ? 'Instant recommendation • 10-30m delivery' : 'Recomendación al instante • Entrega 10-30 min'}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadNotice(false);
              }}
              className="text-slate-400 hover:text-white ml-1 p-0.5 rounded-full hover:bg-white/10"
              title={isEn ? 'Dismiss' : 'Cerrar notificación'}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          id="btn-open-ai-chat"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer relative ${
            isOpen
              ? 'w-13 h-13 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700 scale-95'
              : 'w-14 h-14 bg-gradient-to-tr from-[#0066FF] via-[#0052cc] to-indigo-600 text-white hover:scale-110 active:scale-95 shadow-blue-500/40 hover:shadow-blue-500/60 ring-4 ring-blue-500/20'
          }`}
          aria-label={
            isOpen
              ? isEn
                ? 'Close UpClic AI Assistant'
                : 'Cerrar Asistente UpClic'
              : isEn
              ? 'Open UpClic AI Assistant'
              : 'Abrir Asistente UpClic'
          }
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0066FF] rounded-full animate-pulse shadow-sm" />
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -bottom-1 -left-1 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
          )}
        </button>
      </div>

      {/* Expandable Chat Dialog Window */}
      {isOpen && (
        <div
          id="ai-assistant-modal"
          className={`fixed z-[90] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-auto md:bottom-20 md:right-6 md:w-[620px] md:h-[720px]'
              : 'bottom-28 sm:bottom-24 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[440px] max-w-[460px] h-[580px] max-h-[calc(100vh-140px)]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-[#0a2342] to-blue-950 text-white flex items-center justify-between shadow-md shrink-0 border-b border-blue-900/50">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-inner ring-2 ring-blue-400/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-xs" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    {isEn ? 'UpClic AI Advisor' : 'Asesor Inteligente UpClic'}
                  </h3>
                  <span className="bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-400/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                    {isEn ? 'AI Advisor' : 'Asesor IA'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isEn ? 'Online • License Recommendation & Support' : 'En línea • Asesoría de software y licencias'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? (isEn ? 'Standard view' : 'Vista normal') : (isEn ? 'Expand view' : 'Expandir vista')}
                className="hidden md:flex p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Expandir o contraer ventana"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                title={isEn ? 'Restart conversation' : 'Reiniciar conversación'}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label={isEn ? 'Restart conversation' : 'Reiniciar conversación'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isEn ? 'Minimize window' : 'Minimizar ventana'}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label={isEn ? 'Close chat' : 'Cerrar chat'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery & Trust Ribbon */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 px-3.5 py-1.5 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900 shrink-0">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                {isEn ? 'Guaranteed delivery: ' : 'Entrega digital garantizada: '}
                <strong className="text-blue-700 font-extrabold">10 a 30 min</strong>
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowGuidedAdvisor((prev) => !prev)}
              className="inline-flex items-center gap-1 font-bold text-xs text-[#0066FF] hover:text-[#0052cc] bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Compass className="w-3 h-3 text-[#0066FF]" />
              <span>{showGuidedAdvisor ? (isEn ? 'Close Guide' : 'Cerrar Guía') : (isEn ? '🎯 Quick Guide' : '🎯 Asesor Guiado')}</span>
            </button>
          </div>

          {/* Guided License Recommender Drawer (Collapsible) */}
          {showGuidedAdvisor && (
            <div className="bg-slate-900 text-white p-3 border-b border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  {isEn ? 'Select your scenario for an instant recommendation:' : 'Selecciona tu caso para una recomendación a la medida:'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGuidedAdvisor(false)}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {guidedScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleSendMessage(scenario.prompt)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-left transition-all border border-slate-700/60 hover:border-blue-400 cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-base shrink-0">{scenario.icon}</span>
                    <span className="text-[11px] font-bold text-slate-100 leading-tight">
                      {scenario.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/70 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#0066FF] to-[#0052cc] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {/* Bot Message Header with Audio readout button */}
                  {msg.role === 'model' && (
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-bold text-blue-700">
                        <Bot className="w-3 h-3" />
                        UpClic AI
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSpeech(msg.id, msg.content)}
                        className={`p-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                          speakingMessageId === msg.id
                            ? 'bg-blue-100 text-blue-700 font-bold'
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title={speakingMessageId === msg.id ? (isEn ? 'Stop audio' : 'Detener audio') : (isEn ? 'Listen to answer' : 'Escuchar respuesta')}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                            <span className="text-[9px]">{isEn ? 'Playing' : 'Leyendo'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[9px]">{isEn ? 'Listen' : 'Escuchar'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message body text */}
                  <div className="whitespace-pre-line font-sans text-[12px] text-slate-800">
                    {renderFormattedText(msg.content)}
                  </div>

                  {/* Inline Suggested Products Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#0066FF]" />
                          {isEn ? 'Recommended licenses:' : 'Licencias recomendadas para ti:'}
                        </p>
                        <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          ⚡ 10-30 min
                        </span>
                      </div>

                      {msg.suggestedProducts.map((p) => {
                        const isAdded = addedItemSlug === p.slug;

                        return (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-sm transition-all flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div
                                onClick={() => handleProductClick(p.slug)}
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 group"
                              >
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-11 h-11 object-contain bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                                      {p.badge || 'Oficial'}
                                    </span>
                                    {p.duration && (
                                      <span className="text-[9px] text-slate-500 font-medium">
                                        • {p.duration}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-[#0066FF] transition-colors">
                                    {p.name}
                                  </h4>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-[#0066FF] font-black text-sm">
                                      {formatPrice(p.price)}
                                    </span>
                                    {p.oldPrice && (
                                      <span className="text-[10px] text-slate-400 line-through">
                                        {formatPrice(p.oldPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(p.slug)}
                                  title={isEn ? 'Add to cart' : 'Añadir al carrito'}
                                  className={`p-2 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-xs hover:shadow'
                                  }`}
                                >
                                  {isAdded ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <ShoppingCart className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleProductClick(p.slug)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                  title={isEn ? 'View specifications' : 'Ver ficha técnica'}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* WhatsApp Admin Escalation Box */}
                  {msg.showAdminWhatsApp && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          isEn
                            ? 'Hello UpClic Administrator, I need human licensing support from the website.'
                            : 'Hola Administrador de UpClic, solicito asistencia técnica personalizada con una consulta de licencias.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs transition-all shadow-sm hover:shadow"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{isEn ? 'Open WhatsApp Admin Chat' : 'Hablar con Administrador por WhatsApp'}</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1.5">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 animate-in fade-in duration-150">
                <div className="bg-white p-3.5 rounded-2xl rounded-bl-xs border border-slate-200/90 shadow-2xs flex items-center gap-2.5 text-xs text-slate-600">
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
                  <span className="text-[11px] font-semibold text-slate-700">
                    {isEn
                      ? 'UpClic AI is analyzing catalog & recommendations...'
                      : 'Asesor UpClic está analizando opciones y requisitos...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips Carousel */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((qp, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 hover:text-[#0066FF] hover:border-blue-300 text-slate-700 text-[11px] font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
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
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={
                isListening
                  ? isEn
                    ? 'Stop listening'
                    : 'Detener dictado'
                  : isEn
                  ? 'Speak your question'
                  : 'Dictar consulta por voz'
              }
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? isEn
                    ? 'Listening... speak now'
                    : 'Escuchando... habla ahora'
                  : isEn
                  ? 'Ask about Office, Windows, hardware needs...'
                  : 'Pregunta sobre Office, Windows, qué licencia necesitas...'
              }
              disabled={isLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0066FF] to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-md shrink-0"
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
