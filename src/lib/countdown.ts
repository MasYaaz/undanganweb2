// src/lib/countdown.ts

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Menghitung selisih waktu dari sekarang ke target date
 * @param target Tanggal tujuan (biasanya tanggal pernikahan)
 * @returns Object berisi sisa waktu (hari, jam, menit, detik)
 */
export function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
