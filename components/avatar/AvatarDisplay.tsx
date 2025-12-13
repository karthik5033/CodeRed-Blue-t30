'use client';

import { motion } from 'motion/react';
import { AvatarConfig } from '@/types/avatar-types';
import { useMemo, useEffect, useState, useRef } from 'react';

interface AvatarDisplayProps {
    config: AvatarConfig;
    isAnimating?: boolean; // Prop for talking/acting
}

export default function AvatarDisplay({ config, isAnimating = false }: AvatarDisplayProps) {
    // Construct DiceBear URL
    const diceBearUrl = useMemo(() => {
        // Use v7.x which is known stable for avataaars
        const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';

        // Map our config to DiceBear params
        const params = new URLSearchParams();

        // 1. Core Params
        params.append('seed', config.id || 'default');
        params.append('backgroundColor', 'b6e3f4');
        params.append('radius', '20');

        // 2. Skin
        if (config.face?.skinTone) {
            params.append('skinColor', config.face.skinTone.replace('#', ''));
        }

        // 3. Hair
        if (config.hair?.color) {
            params.append('hairColor', config.hair.color.replace('#', ''));
        }

        const hairMap: Record<string, string> = {
            'buzz': 'shortHair',
            'short': 'shortHair',
            'medium': 'bob',
            'long': 'longHair',
            'curly': 'curly',
            'straight': 'straight01',
            'wavy': 'wavyBob',
            'bald': 'noHair',
            'ponytail': 'straight02', // Fallback for legacy 
            'bun': 'bun',
            'mohawk': 'mohawk'
        };
        // Default to shortHair if style not found
        const style = config.hair?.style ? (hairMap[config.hair.style] || 'shortHair') : 'shortHair';
        params.append('top', style);

        // 3.5 Facial Hair
        if (config.face?.facialHair && config.face.facialHair !== 'none') {
            const beardMap: Record<string, string> = {
                'beard': 'beardMedium,beardLight,beardMajestic',
                'mustache': 'moustacheFancy,moustacheMagnum'
            };
            params.append('facialHair', beardMap[config.face.facialHair] || 'beardMedium');
            params.append('facialHairProbability', '100');
        } else {
            params.append('facialHairProbability', '0');
        }

        // 4. Accessories
        const hasGlasses = config.accessories?.some(a => a.type === 'glasses' && a.visible);
        if (hasGlasses) {
            params.append('accessories', 'sunglasses,prescription01,prescription02');
            params.append('accessoriesProbability', '100');
        } else {
            params.append('accessoriesProbability', '0');
        }

        const hasHat = config.accessories?.some(a => a.type === 'hat' && a.visible);
        if (hasHat) {
            params.append('hat', 'hat'); // DiceBear hat param support
            params.append('hatProbability', '100');
        }

        // 5. Mouth / Emotion
        const mouthMap: Record<string, string> = {
            'smile': 'smile',
            'happy': 'smile',
            'sad': 'sad',
            'frown': 'sad',
            'neutral': 'default',
            'smirk': 'twinkle',
            'surprised': 'scream'
        };
        // Safely access nested properties
        const emotion = config.animations?.emotion || config.face?.mouthShape || 'neutral';
        const mouth = mouthMap[emotion] || 'default';
        params.append('mouth', mouth);

        // 6. Eyes
        const eyeMap: Record<string, string> = {
            'happy': 'happy',
            'sad': 'default',
            'neutral': 'default',
            'wink': 'wink',
            'sleepy': 'close'
        };
        const eyeEmotion = config.animations?.emotion || 'neutral';
        const eyes = eyeMap[eyeEmotion] || 'default';
        params.append('eyes', eyes);

        // Ensure format is valid
        return `${baseUrl}?${params.toString()}`;
    }, [config]);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-zinc-50 overflow-hidden">
            {/* Dynamic Background Aura */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.img
                key={diceBearUrl} // Force re-render on url change for animation
                src={diceBearUrl}
                alt="Avatar"
                className="w-full h-full max-h-[80vh] object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
        </div>
    );
}
