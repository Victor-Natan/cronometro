"use client";

import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/data-simple";

function formatTime(value: number) {
  return value.toString().padStart(2, "0");
}

function getTimeParts(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return { days, hours, minutes, seconds };
}

function normalizeStartDate(value: Date | string) {
  if (value instanceof Date) {
    return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  }

  if (typeof value === "string") {
    const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (brMatch) {
      const [, day, month, year] = brMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  return new Date(value);
}

export default function Cronometro() {
  const startDate = useMemo(() => normalizeStartDate(siteConfig.startDate), []);
  const unlockDate = useMemo(() => {
    const target = new Date(startDate);
    target.setFullYear(target.getFullYear() + 2);
    return target;
  }, [startDate]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const remainingMs = Math.max(0, unlockDate.getTime() - now.getTime());
  const elapsed = getTimeParts(elapsedMs);
  const remaining = getTimeParts(remainingMs);
  const isUnlocked = now >= unlockDate;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-200/30 backdrop-blur-md">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tempo decorrido desde o começo</h2>
          <p className="mt-2 text-slate-600">Início: {startDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-950/95 px-6 py-5 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Decorrido</p>
            <p className="mt-3 text-3xl font-semibold">
              {elapsed.days}d {formatTime(elapsed.hours)}:{formatTime(elapsed.minutes)}:{formatTime(elapsed.seconds)}
            </p>
          </div>
          <div className="rounded-3xl bg-emerald-950/95 px-6 py-5 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Até 2 anos</p>
            <p className="mt-3 text-3xl font-semibold">
              {remaining.days}d {formatTime(remaining.hours)}:{formatTime(remaining.minutes)}:{formatTime(remaining.seconds)}
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-slate-800">A página <strong>Recordação 2 Anos</strong> está {isUnlocked ? "liberada" : "bloqueada"}.</p>
          <p className="mt-2 text-sm text-slate-500">Liberada em {unlockDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}.</p>
        </div>
      </div>
    </section>
  );
}
