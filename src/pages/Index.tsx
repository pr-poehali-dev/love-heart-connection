import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { DEMO_HEARTS } from "@/components/love/types";
import type { Tab, Heart, Particle, FloatingHeart } from "@/components/love/types";
import ParticleLayer from "@/components/love/ParticleLayer";
import { MapTab, MessagesTab, SettingsTab, HeartModal, ComposeModal } from "@/components/love/LoveTabs";

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

      <ParticleLayer particles={particles} floatingHearts={floatingHearts} />

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
