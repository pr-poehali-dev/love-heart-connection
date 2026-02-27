import { STARS } from "./types";
import type { Particle, FloatingHeart } from "./types";

interface ParticleLayerProps {
  particles: Particle[];
  floatingHearts: FloatingHeart[];
}

export default function ParticleLayer({ particles, floatingHearts }: ParticleLayerProps) {
  return (
    <>
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

      {/* Частицы и плавающие сердечки */}
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
    </>
  );
}
