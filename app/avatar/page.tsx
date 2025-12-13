'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Sparkles, User, Palette, MessageSquare } from 'lucide-react';
import AvatarChat from '@/components/avatar/AvatarChat';
import CustomizationPanel from '@/components/avatar/CustomizationPanel';
import AvatarPresets from '@/components/avatar/AvatarPresets';
import { AvatarConfig } from '@/types/avatar-types';

import AvatarDisplay from '@/components/avatar/AvatarDisplay';

// ... (keep other imports)



const defaultAvatar: AvatarConfig = {
    id: 'default',
    name: 'Base Model',
    face: {
        skinTone: '#e0ac69', // Neutral tan
        eyeColor: '#607d8b',  // Grey-blue
        eyeShape: 'almond',
        eyeSize: 50,
        noseSize: 50,
        noseShape: 'medium',
        mouthShape: 'neutral',
        mouthSize: 50,
        cheekboneHeight: 50,
        jawShape: 'oval',
        facialHair: 'none',
    },
    hair: {
        style: 'buzz',
        color: '#212121',
        length: 20,
        volume: 20,
    },
    accessories: [],
    body: {
        build: 'average',
        height: 50,
        shoulderWidth: 50,
    },
    voice: {
        voice: 'neutral',
        pitch: 100,
        speed: 1.0,
        volume: 80,
    },
    animations: {
        idle: 'breathing',
        talking: 'lip-sync',
        gesture: 'none',
        emotion: 'neutral',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export default function AvatarBuilderPage() {
    const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatar);
    const [activeTab, setActiveTab] = useState<'chat' | 'customize' | 'presets'>('chat');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAvatarUpdate = (updates: Partial<AvatarConfig>) => {
        setAvatarConfig(prev => ({
            ...prev,
            ...updates,
            updatedAt: new Date().toISOString(),
        }));
    };

    const handlePresetSelect = (preset: Partial<AvatarConfig>) => {
        handleAvatarUpdate(preset);
    };

    const handleSpeak = (text: string) => {
        setIsAnimating(true);
        // Voice synthesis will be handled by VoiceControls component
        setTimeout(() => setIsAnimating(false), 3000);
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-zinc-100">
            {/* Header */}
            <header className="h-16 px-6 border-b border-zinc-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Avatar Builder
                        </h1>
                        <p className="text-xs text-zinc-500">Create your personalized 3D avatar</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all shadow-sm">
                        Export Avatar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all shadow-md">
                        Save Avatar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <PanelGroup direction="horizontal">
                    {/* Left Panel - Controls */}
                    <Panel defaultSize={35} minSize={25} maxSize={45} className="flex flex-col">
                        <div className="h-full flex flex-col bg-white border-r border-zinc-200">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-zinc-200 bg-zinc-50">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === 'chat'
                                        ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                                        : 'text-zinc-600 hover:bg-white/50'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    AI Chat
                                </button>
                                <button
                                    onClick={() => setActiveTab('customize')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === 'customize'
                                        ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                                        : 'text-zinc-600 hover:bg-white/50'
                                        }`}
                                >
                                    <Palette className="w-4 h-4" />
                                    Customize
                                </button>
                                <button
                                    onClick={() => setActiveTab('presets')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === 'presets'
                                        ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                                        : 'text-zinc-600 hover:bg-white/50'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Presets
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-hidden">
                                {activeTab === 'chat' && (
                                    <AvatarChat
                                        avatarConfig={avatarConfig}
                                        onAvatarUpdate={handleAvatarUpdate}
                                        onSpeak={handleSpeak}
                                    />
                                )}
                                {activeTab === 'customize' && (
                                    <CustomizationPanel
                                        avatarConfig={avatarConfig}
                                        onAvatarUpdate={handleAvatarUpdate}
                                    />
                                )}
                                {activeTab === 'presets' && (
                                    <AvatarPresets onPresetSelect={handlePresetSelect} />
                                )}
                            </div>
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-2 bg-zinc-200 hover:bg-purple-400 transition-colors" />

                    {/* Right Panel - 3D Preview */}
                    <Panel defaultSize={65} minSize={55}>
                        <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50">
                            <AvatarDisplay
                                config={avatarConfig}
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}
