"use client";

import { useState, useEffect } from "react";

export function useMorphText(texts: string[], interval = 3000) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!texts || texts.length === 0) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, interval);

        return () => clearInterval(timer);
    }, [texts, interval]);

    return texts[index] || "";
}
