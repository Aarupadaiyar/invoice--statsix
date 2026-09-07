"use client";

import { useEffect, useRef, useState } from "react";

export function TaglineReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className="max-w-[680px] mx-auto text-center text-4xl sm:text-5xl font-semibold leading-tight text-balance"
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            color: inView ? "#1a1d23" : "rgba(26,29,35,0.28)",
            transitionDelay: inView ? `${i * 55}ms` : "0ms",
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
