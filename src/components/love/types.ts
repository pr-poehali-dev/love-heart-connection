export type Tab = "map" | "messages" | "settings";

export interface Heart {
  id: number;
  x: number;
  y: number;
  message: string;
  from: string;
  distance: number;
  received: boolean;
  time: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  emoji: string;
  size: number;
}

export interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export const DEMO_HEARTS: Heart[] = [
  { id: 1, x: 52, y: 44, message: "Ты — моя вселенная, любимая...", from: "Александр", distance: 4, received: true, time: "сейчас" },
  { id: 2, x: 38, y: 58, message: "Каждый миг с тобой — как первый рассвет", from: "Саша", distance: 9, received: true, time: "5 мин" },
  { id: 3, x: 65, y: 35, message: "Я думаю о тебе всё время", from: "Александр", distance: 7, received: false, time: "12 мин" },
];

const STAR_COUNT = 80;

export const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));
