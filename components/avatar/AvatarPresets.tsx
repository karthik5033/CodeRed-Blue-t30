'use client';

import { AvatarPreset } from '@/types/avatar-types';
import { Sparkles, User, PartyPopper, Briefcase } from 'lucide-react';

interface AvatarPresetsProps {
    onPresetSelect: (config: Partial<any>) => void;
}

const PRESETS: AvatarPreset[] = [
    {
        id: 'preset-1',
        name: 'Professional',
        description: 'Clean and business-ready look',
        thumbnail: '',
        category: 'professional',
        config: {
            face: {
                skinTone: '#f4c2a8',
                eyeColor: '#4a90e2',
                eyeShape: 'almond',
                eyeSize: 50,
                noseSize: 50,
                noseShape: 'medium',
                mouthShape: 'smile',
                mouthSize: 45,
                cheekboneHeight: 50,
                jawShape: 'oval',
            },
            hair: {
                style: 'short',
                color: '#3d2817',
                length: 30,
                volume: 50,
            },
            accessories: [
                {
                    id: 'glasses-pro',
                    type: 'glasses',
                    style: 'professional',
                    color: '#212121',
                    visible: true,
                },
            ],
        },
    },
    {
        id: 'preset-2',
        name: 'Casual Cool',
        description: 'Relaxed and friendly vibe',
        thumbnail: '',
        category: 'casual',
        config: {
            face: {
                skinTone: '#d4a373',
                eyeColor: '#388e3c',
                eyeShape: 'wide',
                eyeSize: 55,
                noseSize: 50,
                noseShape: 'medium',
                mouthShape: 'smile',
                mouthSize: 55,
                cheekboneHeight: 50,
                jawShape: 'round',
            },
            hair: {
                style: 'medium',
                color: '#8d6e63',
                length: 60,
                volume: 70,
            },
            accessories: [],
        },
    },
    {
        id: 'preset-3',
        name: 'Artistic',
        description: 'Creative and expressive',
        thumbnail: '',
        category: 'fantasy',
        config: {
            face: {
                skinTone: '#fce4d8',
                eyeColor: '#7b1fa2',
                eyeShape: 'almond',
                eyeSize: 60,
                noseSize: 45,
                noseShape: 'small',
                mouthShape: 'smirk',
                mouthSize: 50,
                cheekboneHeight: 60,
                jawShape: 'heart',
            },
            hair: {
                style: 'long',
                color: '#ec407a',
                length: 80,
                volume: 80,
            },
            accessories: [],
        },
    },
    {
        id: 'preset-4',
        name: 'Tech Genius',
        description: 'Modern and innovative',
        thumbnail: '',
        category: 'professional',
        config: {
            face: {
                skinTone: '#c68642',
                eyeColor: '#1976d2',
                eyeShape: 'narrow',
                eyeSize: 48,
                noseSize: 50,
                noseShape: 'medium',
                mouthShape: 'neutral',
                mouthSize: 48,
                cheekboneHeight: 50,
                jawShape: 'square',
            },
            hair: {
                style: 'buzz',
                color: '#212121',
                length: 20,
                volume: 40,
            },
            accessories: [
                {
                    id: 'glasses-tech',
                    type: 'glasses',
                    style: 'modern',
                    color: '#1976d2',
                    visible: true,
                },
            ],
        },
    },
    {
        id: 'preset-5',
        name: 'Party Star',
        description: 'Fun and energetic',
        thumbnail: '',
        category: 'cartoon',
        config: {
            face: {
                skinTone: '#f4c2a8',
                eyeColor: '#ffd54f',
                eyeShape: 'wide',
                eyeSize: 65,
                noseSize: 45,
                noseShape: 'button',
                mouthShape: 'smile',
                mouthSize: 60,
                cheekboneHeight: 55,
                jawShape: 'round',
            },
            hair: {
                style: 'curly',
                color: '#1976d2',
                length: 70,
                volume: 90,
            },
            accessories: [
                {
                    id: 'hat-party',
                    type: 'hat',
                    style: 'party',
                    color: '#ec407a',
                    visible: true,
                },
            ],
        },
    },
    {
        id: 'preset-6',
        name: 'Classic',
        description: 'Timeless and elegant',
        thumbnail: '',
        category: 'realistic',
        config: {
            face: {
                skinTone: '#d4a373',
                eyeColor: '#5d4037',
                eyeShape: 'almond',
                eyeSize: 50,
                noseSize: 50,
                noseShape: 'medium',
                mouthShape: 'smile',
                mouthSize: 50,
                cheekboneHeight: 50,
                jawShape: 'oval',
            },
            hair: {
                style: 'straight',
                color: '#5d4037',
                length: 70,
                volume: 60,
            },
            accessories: [],
        },
    },
];

const categoryIcons = {
    professional: Briefcase,
    casual: User,
    fantasy: Sparkles,
    cartoon: PartyPopper,
    realistic: User,
};

export default function AvatarPresets({ onPresetSelect }: AvatarPresetsProps) {
    return (
        <div className="h-full overflow-y-auto p-4 bg-zinc-50">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-zinc-800">Avatar Presets</h3>
                <p className="text-xs text-zinc-500 mt-1">
                    Choose a starting point and customize further
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {PRESETS.map((preset) => {
                    const Icon = categoryIcons[preset.category];

                    return (
                        <button
                            key={preset.id}
                            onClick={() => onPresetSelect(preset.config)}
                            className="group relative overflow-hidden rounded-xl bg-white border-2 border-zinc-200 hover:border-purple-500 transition-all hover:shadow-lg p-4 text-left"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-zinc-800 group-hover:text-purple-700 transition-colors">
                                        {preset.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {preset.description}
                                    </p>

                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-full capitalize">
                                            {preset.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                    );
                })}
            </div>

            {/* Custom Preset Card */}
            <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-zinc-300 bg-white">
                <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-sm font-medium text-zinc-700">Create Custom</p>
                    <p className="text-xs text-zinc-500 mt-1">
                        Start from scratch and build your unique avatar
                    </p>
                </div>
            </div>
        </div>
    );
}
