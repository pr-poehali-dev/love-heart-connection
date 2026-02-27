import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

type Tab = "map" | "messages" | "settings";

interface Heart {
  id: number;
  x: number;
  y: number;
  message: string;
  from: string;
  distance: number;
  received: boolean;
  time: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  emoji: string;
  size: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const DEMO_HEARTS: Heart[] = [
  { id: 1, x: 52, y: 44, message: "Ты — моя вселенная, любимая...", from: "Александр", distance: 4, received: true, time: "сейчас" },
  { id: 2, x: 38, y: 58, message: "Каждый миг с тобой — как первый рассвет", from: "Саша", distance: 9, received: true, time: "5 мин" },
  { id: 3, x: 65, y: 35, message: "Я думаю о тебе всё время", from: "Александр", distance: 7, received: false, time: "12 мин" },
];

const STAR_COUNT = 80;

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

export default function Index() {
  const [tab, setTab] = useState<Tab>("map");
  const [hearts] = useState<Heart[]>(DEMO_HEARTS);
  const [selectedHeart, setSelectedHeart] = useState<Heart | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [radius, setRadius] = useState(10);
  const [notifications, setNotifications] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [receivedCount] = useState(2);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const particleIdRef = useRef(0);
  const floatIdRef = useRef(0);

  const burstParticles = useCallback((cx: number, cy: number) => {
    const emojis = ["❤️", "💕", "✨", "💫", "🌸", "💖", "⭐"];
    const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      return {
        id: ++particleIdRef.current,
        x: cx,
        y: cy,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 14 + Math.random() * 14,
      };
    });
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles((p) => p.filter((x) => !newParticles.find((n) => n.id === x.id)));
    }, 1100);

    const newFloats: FloatingHeart[] = Array.from({ length: 6 }, () => ({
      id: ++floatIdRef.current,
      x: cx + (Math.random() - 0.5) * 60,
      y: cy,
      size: 20 + Math.random() * 20,
      delay: Math.random() * 0.4,
    }));
    setFloatingHearts((f) => [...f, ...newFloats]);
    setTimeout(() => {
      setFloatingHearts((f) => f.filter((x) => !newFloats.find((n) => n.id === x.id)));
    }, 2200);
  }, []);

  const openHeart = (heart: Heart, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setSelectedHeart(heart);
  };

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSend = () => {
    if (!composeText.trim()) return;
    burstParticles(window.innerWidth / 2, window.innerHeight / 2);
    setComposeText("");
    setShowCompose(false);
    showNotification("Признание отправлено с любовью ✨");
  };

  useEffect(() => {
    if (tab === "map") {
      const t = setTimeout(() => showNotification("💌 Новое признание рядом — 4 метра!"), 2000);
      return () => clearTimeout(t);
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative" style={{ fontFamily: "'Montserrat', sans-serif", userSelect: "none" }}>

      {/* Звёзды */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {STARS.map((s) => (
          <div key={s.id} className="star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`, opacity: 0.3,
          }} />
        ))}
      </div>

      {/* Туманности */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full animate-orb" style={{
          top: "10%", left: "20%",
          background: "radial-gradient(circle, rgba(232,84,122,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div className="absolute w-80 h-80 rounded-full animate-orb" style={{
          bottom: "20%", right: "15%",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          filter: "blur(40px)", animationDelay: "3s",
        }} />
      </div>

      {/* Частицы */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((p) => (
          <div key={p.id} className="particle" style={{
            left: p.x, top: p.y, fontSize: p.size,
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`,
          } as React.CSSProperties}>
            {p.emoji}
          </div>
        ))}
        {floatingHearts.map((h) => (
          <div key={h.id} className="animate-heart-float" style={{
            position: "absolute", left: h.x, top: h.y,
            fontSize: h.size, animationDelay: `${h.delay}s`, pointerEvents: "none",
          }}>❤️</div>
        ))}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-in-bottom">
          <div className="glass-rose px-5 py-3 rounded-2xl text-sm font-medium" style={{ color: "#f8bdd4" }}>
            {toastMsg}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-display shimmer-text" style={{ fontWeight: 300, letterSpacing: "0.08em" }}>
            Двое
          </h1>
          <p className="text-xs" style={{ color: "rgba(252,228,236,0.4)", letterSpacing: "0.15em", marginTop: -2 }}>
            {tab === "map" ? "радар признаний" : tab === "messages" ? "ваши признания" : "настройки"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {receivedCount > 0 && (
            <div className="relative">
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center cursor-pointer"
                onClick={() => setTab("messages")}>
                <span className="text-sm">💌</span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: "#e8547a", color: "#fff", fontSize: 10 }}>
                {receivedCount}
              </span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #e8547a, #7c3aed)", color: "#fff", fontWeight: 600 }}>
            А
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="pt-20 pb-24 min-h-screen">
        {tab === "map" && <MapTab hearts={hearts} onHeartClick={openHeart} radius={radius} />}
        {tab === "messages" && <MessagesTab hearts={hearts} onHeartClick={openHeart} />}
        {tab === "settings" && (
          <SettingsTab
            radius={radius} setRadius={setRadius}
            notifications={notifications} setNotifications={setNotifications}
            privateMode={privateMode} setPrivateMode={setPrivateMode}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4">
        <div className="glass rounded-2xl flex items-center justify-around px-2 py-3 mx-auto max-w-sm">
          {([
            { id: "map", icon: "Compass", label: "Карта" },
            { id: "messages", icon: "Heart", label: "Признания" },
            { id: "settings", icon: "Settings2", label: "Настройки" },
          ] as { id: Tab; icon: string; label: string }[]).map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
              style={{
                color: tab === item.id ? "#e8547a" : "rgba(252,228,236,0.4)",
                background: tab === item.id ? "rgba(232,84,122,0.1)" : "transparent",
              }}>
              <Icon name={item.icon} fallback="Circle" size={20} />
              <span style={{ fontWeight: tab === item.id ? 600 : 400, fontSize: 10 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* FAB — отправить признание */}
      {tab !== "settings" && (
        <button onClick={() => setShowCompose(true)}
          className="heart-btn fixed right-5 bottom-28 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-glow-pulse"
          style={{ background: "linear-gradient(135deg, #e8547a, #c23060)" }}>
          <span className="text-2xl">❤️</span>
        </button>
      )}

      {selectedHeart && <HeartModal heart={selectedHeart} onClose={() => setSelectedHeart(null)} />}
      {showCompose && (
        <ComposeModal text={composeText} onChange={setComposeText} onSend={handleSend} onClose={() => setShowCompose(false)} />
      )}
    </div>
  );
}

/* ===== MAP TAB ===== */
function MapTab({ hearts, onHeartClick, radius }: {
  hearts: Heart[];
  onHeartClick: (h: Heart, e: React.MouseEvent) => void;
  radius: number;
}) {
  return (
    <div className="px-4">
      <div className="map-container map-grid rounded-3xl overflow-hidden relative" style={{ height: "62vh", minHeight: 340 }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="absolute rounded-full border" style={{
              width: `${i * 30}%`, height: `${i * 30}%`,
              borderColor: `rgba(232,84,122,${0.12 - i * 0.03})`,
            }} />
          ))}
          <div className="absolute rounded-full border-2 border-dashed" style={{
            width: "30%", height: "30%",
            borderColor: "rgba(232,84,122,0.4)",
            animation: "mapPing 2.5s ease-out infinite",
          }} />
          <div className="absolute w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "rgba(232,84,122,0.3)", boxShadow: "0 0 0 6px rgba(232,84,122,0.12)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#e8547a" }} />
          </div>
        </div>

        {hearts.map((h) => (
          <button key={h.id} onClick={(e) => onHeartClick(h, e)}
            className="absolute transition-transform hover:scale-125 active:scale-110"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(232,84,122,0.25)", animationDuration: "2s" }} />
              <div className="relative w-10 h-10 rounded-full glass-rose flex items-center justify-center shadow-lg"
                style={{ boxShadow: "0 0 15px rgba(232,84,122,0.4)" }}>
                <span className="text-lg animate-heart-pulse">{h.received ? "💌" : "💝"}</span>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-2 py-0.5 rounded-full"
                style={{ fontSize: 9, color: "rgba(252,228,236,0.7)" }}>
                {h.distance}м · {h.from}
              </div>
            </div>
          </button>
        ))}

        <div className="absolute top-3 left-3 glass px-3 py-2 rounded-xl" style={{ fontSize: 11 }}>
          <span style={{ color: "rgba(252,228,236,0.7)" }}>📡 Радиус: </span>
          <span style={{ color: "#e8547a" }}>{radius}м</span>
        </div>
        <div className="absolute top-3 right-3 glass px-3 py-2 rounded-xl" style={{ fontSize: 11, color: "rgba(252,228,236,0.7)" }}>
          ❤️ {hearts.length} рядом
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="font-display text-lg" style={{ color: "rgba(252,228,236,0.4)", fontStyle: "italic", fontWeight: 300 }}>
          Нажми на сердечко, чтобы прочитать признание
        </p>
      </div>
    </div>
  );
}

/* ===== MESSAGES TAB ===== */
function MessagesTab({ hearts, onHeartClick }: {
  hearts: Heart[];
  onHeartClick: (h: Heart, e: React.MouseEvent) => void;
}) {
  const [filter, setFilter] = useState<"all" | "received" | "sent">("all");
  const filtered = filter === "all" ? hearts
    : filter === "received" ? hearts.filter(h => h.received)
    : hearts.filter(h => !h.received);

  return (
    <div className="px-4 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["all", "received", "sent"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === f ? "linear-gradient(135deg, #e8547a, #c23060)" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#fff" : "rgba(252,228,236,0.5)",
              border: filter === f ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}>
            {f === "all" ? "Все" : f === "received" ? "💌 Получила" : "💝 Отправила"}
          </button>
        ))}
      </div>

      {filtered.map((heart, i) => (
        <div key={heart.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
          <button className="w-full text-left glass rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
            onClick={(e) => onHeartClick(heart, e)}
            style={{ border: "1px solid rgba(232,84,122,0.15)" }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
                style={{ background: heart.received ? "rgba(232,84,122,0.15)" : "rgba(124,58,237,0.15)" }}>
                {heart.received ? "💌" : "💝"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm" style={{ color: heart.received ? "#e8547a" : "#a78bfa" }}>
                    {heart.received ? `от ${heart.from}` : `для ${heart.from}`}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs" style={{ color: "rgba(252,228,236,0.35)" }}>{heart.distance}м</span>
                    <span className="text-xs" style={{ color: "rgba(252,228,236,0.35)" }}>{heart.time}</span>
                  </div>
                </div>
                <p className="font-display text-base truncate"
                  style={{ color: "rgba(252,228,236,0.8)", fontStyle: "italic", fontWeight: 300 }}>
                  {heart.message}
                </p>
              </div>
            </div>
          </button>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💔</div>
          <p className="font-display text-xl" style={{ color: "rgba(252,228,236,0.3)", fontStyle: "italic" }}>
            Пока тишина...
          </p>
        </div>
      )}
    </div>
  );
}

/* ===== SETTINGS TAB ===== */
function SettingsTab({ radius, setRadius, notifications, setNotifications, privateMode, setPrivateMode }: {
  radius: number; setRadius: (v: number) => void;
  notifications: boolean; setNotifications: (v: boolean) => void;
  privateMode: boolean; setPrivateMode: (v: boolean) => void;
}) {
  return (
    <div className="px-4 space-y-4">
      <h2 className="font-display text-2xl mb-6" style={{ color: "rgba(252,228,236,0.7)", fontWeight: 300, fontStyle: "italic" }}>
        Твоё пространство
      </h2>

      {/* Радиус */}
      <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(232,84,122,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(232,84,122,0.15)" }}>
              <span>📡</span>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: "rgba(252,228,236,0.85)" }}>Радиус обнаружения</p>
              <p className="text-xs" style={{ color: "rgba(252,228,236,0.35)" }}>Видимость сердечек</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-display" style={{ color: "#e8547a", fontWeight: 600 }}>{radius}</span>
            <span className="text-xs ml-1" style={{ color: "rgba(252,228,236,0.4)" }}>м</span>
          </div>
        </div>
        <input type="range" min={3} max={50} value={radius} onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full" style={{ accentColor: "#e8547a" }} />
        <div className="flex justify-between mt-1.5 text-xs" style={{ color: "rgba(252,228,236,0.25)" }}>
          <span>3м</span><span>50м</span>
        </div>
      </div>

      {/* Уведомления */}
      <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(232,84,122,0.12)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(232,84,122,0.15)" }}>
              <span>🔔</span>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: "rgba(252,228,236,0.85)" }}>Уведомления</p>
              <p className="text-xs" style={{ color: "rgba(252,228,236,0.35)" }}>Когда партнёр рядом</p>
            </div>
          </div>
          <button onClick={() => setNotifications(!notifications)}
            className="relative w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: notifications ? "#e8547a" : "rgba(255,255,255,0.1)" }}>
            <div className="absolute top-1 rounded-full w-4 h-4 bg-white shadow transition-all duration-300"
              style={{ left: notifications ? "calc(100% - 20px)" : 4 }} />
          </button>
        </div>
      </div>

      {/* Приватность */}
      <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(124,58,237,0.15)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)" }}>
              <span>🌙</span>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: "rgba(252,228,236,0.85)" }}>Приватный режим</p>
              <p className="text-xs" style={{ color: "rgba(252,228,236,0.35)" }}>Только партнёр видит тебя</p>
            </div>
          </div>
          <button onClick={() => setPrivateMode(!privateMode)}
            className="relative w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: privateMode ? "#7c3aed" : "rgba(255,255,255,0.1)" }}>
            <div className="absolute top-1 rounded-full w-4 h-4 bg-white shadow transition-all duration-300"
              style={{ left: privateMode ? "calc(100% - 20px)" : 4 }} />
          </button>
        </div>
      </div>

      {/* Моя пара */}
      <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(232,84,122,0.12)" }}>
        <p className="text-xs mb-3" style={{ color: "rgba(252,228,236,0.4)", letterSpacing: "0.1em" }}>МОЯ ПАРА</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, #e8547a, #7c3aed)" }}>А</div>
          <span style={{ color: "#e8547a" }}>♥</span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, #a78bfa, #e8547a)" }}>М</div>
          <div className="ml-1">
            <p className="text-sm font-medium" style={{ color: "rgba(252,228,236,0.85)" }}>Александр & Маша</p>
            <p className="text-xs" style={{ color: "rgba(252,228,236,0.3)" }}>Вместе 1 год 3 месяца</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== HEART MODAL ===== */
function HeartModal({ heart, onClose }: { heart: Heart; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }} />
      <div className="relative w-full max-w-sm mx-4 mb-6 glass rounded-3xl p-6 animate-slide-in-bottom"
        style={{ border: "1px solid rgba(232,84,122,0.25)", boxShadow: "0 0 60px rgba(232,84,122,0.15)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl animate-heart-pulse">💌</div>
        <div className="mt-4 text-center">
          <p className="text-xs font-semibold mb-1" style={{ color: "rgba(232,84,122,0.7)", letterSpacing: "0.15em" }}>
            {heart.received ? `ОТ ${heart.from.toUpperCase()}` : `ДЛЯ ${heart.from.toUpperCase()}`}
          </p>
          <p className="text-xs mb-5" style={{ color: "rgba(252,228,236,0.3)" }}>
            {heart.distance} метра от тебя · {heart.time}
          </p>
          <p className="font-display text-xl leading-relaxed py-4 px-2"
            style={{ color: "rgba(252,228,236,0.92)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.7 }}>
            «{heart.message}»
          </p>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(252,228,236,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Закрыть
            </button>
            <button className="flex-1 py-3 rounded-2xl text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #e8547a, #c23060)", color: "#fff" }}>
              Ответить 💌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPOSE MODAL ===== */
function ComposeModal({ text, onChange, onSend, onClose }: {
  text: string; onChange: (v: string) => void;
  onSend: () => void; onClose: () => void;
}) {
  const PROMPTS = [
    "Ты — мой лучший миг...",
    "Когда ты рядом, я дышу иначе",
    "Мир прекраснее с тобой",
    "Хочу держать тебя за руку вечно",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div className="relative w-full max-w-sm mx-4 mb-6 glass rounded-3xl p-5 animate-slide-in-bottom"
        style={{ border: "1px solid rgba(232,84,122,0.2)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl" style={{ color: "rgba(252,228,236,0.8)", fontStyle: "italic", fontWeight: 300 }}>
            Написать признание
          </h3>
          <button onClick={onClose} style={{ color: "rgba(252,228,236,0.3)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <textarea value={text} onChange={(e) => onChange(e.target.value)}
          placeholder="Скажи что-то нежное..." rows={4}
          className="w-full rounded-2xl p-4 text-base resize-none outline-none font-display"
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(232,84,122,0.15)",
            color: "rgba(252,228,236,0.85)", fontStyle: "italic", fontWeight: 300,
          }}
          autoFocus
        />
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {PROMPTS.map((p) => (
            <button key={p} onClick={() => onChange(p)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                background: "rgba(232,84,122,0.08)", color: "rgba(232,84,122,0.7)",
                border: "1px solid rgba(232,84,122,0.15)", fontStyle: "italic",
              }}>
              {p}
            </button>
          ))}
        </div>
        <button onClick={onSend} disabled={!text.trim()}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: text.trim() ? "linear-gradient(135deg, #e8547a, #c23060)" : "rgba(255,255,255,0.06)",
            color: text.trim() ? "#fff" : "rgba(252,228,236,0.3)",
          }}>
          Отправить с любовью ❤️
        </button>
      </div>
    </div>
  );
}