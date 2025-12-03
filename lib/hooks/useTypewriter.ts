"use client";

import { useEffect, useState } from "react";

export function useTypewriter(words: string[], speed = 60, pause = 1200) {
  const safeWords = Array.isArray(words) && words.length > 0 ? words : [""]; // fallback
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const current = safeWords[index] ?? "";

    // prevent crashes
    if (current === "") return;

    if (!deleting && subIndex < current.length) {
      setTimeout(() => setSubIndex(subIndex + 1), speed);
    } else if (!deleting && subIndex === current.length) {
      setTimeout(() => setDeleting(true), pause);
    } else if (deleting && subIndex > 0) {
      setTimeout(() => setSubIndex(subIndex - 1), speed / 1.8);
    } else if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % safeWords.length);
    }
  }, [subIndex, deleting, index, safeWords]);

  // Blink caret
  useEffect(() => {
    const timer = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(timer);
  }, []);

  const current = safeWords[index] ?? "";

  return current.substring(0, subIndex) + (blink ? "|" : "");
}
