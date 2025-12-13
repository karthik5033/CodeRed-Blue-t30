'use client';

import { useState } from 'react';
import { AvatarConfig } from '@/types/avatar-types';
import { Smile, Eye, Palette, Users, Volume2, Zap } from 'lucide-react';

interface CustomizationPanelProps {
    avatarConfig: AvatarConfig;
    onAvatarUpdate: (updates: Partial<AvatarConfig>) => void;
}

export default function CustomizationPanel({
    avatarConfig,
    onAvatarUpdate,
}: CustomizationPanelProps) {
    const [activeSection, setActiveSection] = useState<'face' | 'hair' | 'accessories' | 'body' | 'voice'>('face');

    const handleColorChange = (path: string, value: string) => {
        const [category, field] = path.split('.');
        onAvatarUpdate({
            [category]: {
                ...(avatarConfig[category as keyof AvatarConfig] as any),
                [field]: value,
            },
        });
    };

    const handleSliderChange = (path: string, value: number) => {
        const [category, field] = path.split('.');
        onAvatarUpdate({
            [category]: {
                ...(avatarConfig[category as keyof AvatarConfig] as any),
                [field]: value,
            },
        });
    };

    const sections = [
        { id: 'face', label: 'Face', icon: Smile },
        { id: 'hair', label: 'Hair', icon: Palette },
        { id: 'accessories', label: 'Accessories', icon: Eye },
        { id: 'body', label: 'Body', icon: Users },
        { id: 'voice', label: 'Voice', icon: Volume2 },
    ];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Section Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-50 overflow-x-auto">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-all ${activeSection === section.id
                                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                                : 'text-zinc-600 hover:bg-white/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    );
                })}
            </div>

            {/* Section Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeSection === 'face' && (
                    <>
                        {/* Skin Tone */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Skin Tone
                            </label>
                            <input
                                type="color"
                                value={avatarConfig.face.skinTone}
                                onChange={(e) => handleColorChange('face.skinTone', e.target.value)}
                                className="w-full h-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                            />
                        </div>

                        {/* Eye Color */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Eye Color
                            </label>
                            <input
                                type="color"
                                value={avatarConfig.face.eyeColor}
                                onChange={(e) => handleColorChange('face.eyeColor', e.target.value)}
                                className="w-full h-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                            />
                        </div>

                        {/* Eye Size */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Eye Size: {avatarConfig.face.eyeSize}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={avatarConfig.face.eyeSize}
                                onChange={(e) => handleSliderChange('face.eyeSize', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Mouth Shape */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Expression
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['smile', 'neutral', 'frown', 'smirk'].map((shape) => (
                                    <button
                                        key={shape}
                                        onClick={() =>
                                            onAvatarUpdate({
                                                face: { ...avatarConfig.face, mouthShape: shape as any },
                                            })
                                        }
                                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all capitalize ${avatarConfig.face.mouthShape === shape
                                            ? 'bg-purple-50 border-purple-500 text-purple-700'
                                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-purple-300'
                                            }`}
                                    >
                                        {shape}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mouth Size */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Mouth Size: {avatarConfig.face.mouthSize}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={avatarConfig.face.mouthSize}
                                onChange={(e) => handleSliderChange('face.mouthSize', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>
                    </>
                )}

                {activeSection === 'hair' && (
                    <>
                        {/* Hair Color */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Hair Color
                            </label>
                            <input
                                type="color"
                                value={avatarConfig.hair.color}
                                onChange={(e) => handleColorChange('hair.color', e.target.value)}
                                className="w-full h-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                            />
                        </div>

                        {/* Hair Style */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Hair Style
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['short', 'medium', 'long', 'curly', 'straight', 'wavy', 'bald', 'buzz'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() =>
                                            onAvatarUpdate({
                                                hair: { ...avatarConfig.hair, style: style as any },
                                            })
                                        }
                                        className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all capitalize ${avatarConfig.hair.style === style
                                            ? 'bg-purple-50 border-purple-500 text-purple-700'
                                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-purple-300'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hair Length */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Hair Length: {avatarConfig.hair.length}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={avatarConfig.hair.length}
                                onChange={(e) => handleSliderChange('hair.length', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>
                    </>
                )}

                {activeSection === 'accessories' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Add Accessories
                            </label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        const newAccessory = {
                                            id: `glasses-${Date.now()}`,
                                            type: 'glasses' as const,
                                            style: 'regular',
                                            color: '#212121',
                                            visible: true,
                                        };
                                        onAvatarUpdate({
                                            accessories: [...avatarConfig.accessories, newAccessory],
                                        });
                                    }}
                                    className="w-full px-4 py-3 text-sm font-medium bg-white border-2 border-zinc-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                                >
                                    + Add Glasses
                                </button>
                                <button
                                    onClick={() => {
                                        const newAccessory = {
                                            id: `hat-${Date.now()}`,
                                            type: 'hat' as const,
                                            style: 'casual',
                                            color: '#424242',
                                            visible: true,
                                        };
                                        onAvatarUpdate({
                                            accessories: [...avatarConfig.accessories, newAccessory],
                                        });
                                    }}
                                    className="w-full px-4 py-3 text-sm font-medium bg-white border-2 border-zinc-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                                >
                                    + Add Hat
                                </button>
                            </div>

                            {/* Current Accessories */}
                            {avatarConfig.accessories.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-medium text-zinc-500 uppercase">Current Accessories</p>
                                    {avatarConfig.accessories.map((accessory) => (
                                        <div key={accessory.id} className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                                            <span className="text-sm capitalize">{accessory.type}</span>
                                            <button
                                                onClick={() => {
                                                    onAvatarUpdate({
                                                        accessories: avatarConfig.accessories.filter((a) => a.id !== accessory.id),
                                                    });
                                                }}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeSection === 'voice' && (
                    <>
                        {/* Voice Pitch */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Voice Pitch: {avatarConfig.voice.pitch}
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="200"
                                value={avatarConfig.voice.pitch}
                                onChange={(e) => handleSliderChange('voice.pitch', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Voice Speed */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Voice Speed: {avatarConfig.voice.speed.toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={avatarConfig.voice.speed}
                                onChange={(e) => handleSliderChange('voice.speed', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Test Voice */}
                        <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                            <div className="flex items-center justify-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                Test Voice
                            </div>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
