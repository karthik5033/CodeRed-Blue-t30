'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { AvatarConfig, ChatMessage } from '@/types/avatar-types';

interface AvatarChatProps {
    avatarConfig: AvatarConfig;
    onAvatarUpdate: (updates: Partial<AvatarConfig>) => void;
    onSpeak: (text: string) => void;
}

const SUGGESTION_PROMPTS = [
    'Make the hair blue',
    'Add stylish sunglasses',
    'Make it smile bigger',
    'Change skin tone',
    'Add a cool hat',
    'Make eyes green',
];

export default function AvatarChat({
    avatarConfig,
    onAvatarUpdate,
    onSpeak,
}: AvatarChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'system',
            content: 'Hi! I\'m your AI avatar assistant. Tell me how you\'d like to customize your avatar!',
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        try {
            // Parse the command and update avatar
            const updates = parseAvatarCommand(input);

            if (updates) {
                onAvatarUpdate(updates);

                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Great! I've updated your avatar. ${generateUpdateMessage(updates)}`,
                    timestamp: new Date().toISOString(),
                    avatarUpdate: updates,
                };

                setMessages(prev => [...prev, assistantMessage]);
            } else {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'I\'m not sure how to apply that change. Try commands like "make hair red" or "add glasses".',
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('Error processing command:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const parseAvatarCommand = (command: string): Partial<AvatarConfig> | null => {
        const lowerCommand = command.toLowerCase();
        const updates: Partial<AvatarConfig> = {};

        // Helper for deeper updates
        const updateFace = (update: Partial<AvatarConfig['face']>) => {
            updates.face = { ...(updates.face || avatarConfig.face), ...update };
        };
        const updateHair = (update: Partial<AvatarConfig['hair']>) => {
            updates.hair = { ...(updates.hair || avatarConfig.hair), ...update };
        };

        // --- SKIN TONE PARSING ---
        // Enhanced mapping for realistic skin tones triggers
        const skinMap: Record<string, string> = {
            'light': '#fce4d8', 'pale': '#fff0e6', 'fair': '#ffe0d2',
            'medium': '#d4a373', 'tan': '#c68642', 'olive': '#d2b48c',
            'brown': '#8d5524', 'dark': '#5c3317', 'black': '#3d2817', 'deep': '#2a1a10'
        };
        // Check for "skin" keyword context or direct color association
        if (lowerCommand.includes('skin') || lowerCommand.includes('face') || lowerCommand.includes('complexion')) {
            for (const [key, value] of Object.entries(skinMap)) {
                if (lowerCommand.includes(key)) {
                    updateFace({ skinTone: value });
                    break;
                }
            }
        }
        // Direct handling for common user phrases "make her black", "white guy"
        else if (lowerCommand.includes('black') && !lowerCommand.includes('hair') && !lowerCommand.includes('shirt')) {
            updateFace({ skinTone: skinMap.black });
        }
        else if (lowerCommand.includes('white') && !lowerCommand.includes('hair') && !lowerCommand.includes('shirt')) {
            updateFace({ skinTone: skinMap.light });
        }


        // --- HAIR PARSING ---
        // Styles
        const hairStyles = ['short', 'medium', 'long', 'curly', 'straight', 'buzz', 'bald', 'wavy'];
        for (const style of hairStyles) {
            if (lowerCommand.includes(style)) {
                // Map similar styles
                const mappedStyle = style === 'wavy' ? 'curly' : style;
                updateHair({ style: mappedStyle as any });
            }
        }

        // Colors
        const hairColors: Record<string, string> = {
            'red': '#b71c1c', 'ginger': '#d84315', 'orange': '#e65100',
            'blonde': '#fdd835', 'yellow': '#fbc02d', 'gold': '#f9a825',
            'brown': '#5d4037', 'brunette': '#4e342e',
            'black': '#212121', 'dark': '#000000',
            'white': '#fafafa', 'gray': '#9e9e9e', 'silver': '#bdbdbd',
            'blue': '#1565c0', 'pink': '#ad1457', 'purple': '#6a1b9a', 'green': '#2e7d32'
        };
        if (lowerCommand.includes('hair')) {
            for (const [color, hex] of Object.entries(hairColors)) {
                if (lowerCommand.includes(color)) {
                    updateHair({ color: hex });
                    break;
                }
            }
        }

        // --- FEATURES ---
        // Eyes
        if (lowerCommand.includes('eye')) {
            const eyeColors: Record<string, string> = {
                'blue': '#42a5f5', 'light blue': '#90caf9',
                'green': '#66bb6a', 'emerald': '#2e7d32',
                'brown': '#795548', 'hazel': '#8d6e63',
                'gray': '#bdbdbd', 'black': '#212121'
            };
            for (const [color, hex] of Object.entries(eyeColors)) {
                if (lowerCommand.includes(color)) {
                    updateFace({ eyeColor: hex });
                    break;
                }
            }
        }

        // Mouth / Emotion
        if (lowerCommand.includes('smile') || lowerCommand.includes('happy') || lowerCommand.includes('grin')) {
            updateFace({ mouthShape: 'smile' });
            updates.animations = { ...avatarConfig.animations, emotion: 'happy' };
        }
        if (lowerCommand.includes('sad') || lowerCommand.includes('frown') || lowerCommand.includes('unhappy')) {
            updateFace({ mouthShape: 'frown' });
            updates.animations = { ...avatarConfig.animations, emotion: 'sad' };
        }
        if (lowerCommand.includes('neutral') || lowerCommand.includes('serious') || lowerCommand.includes('straight face')) {
            updateFace({ mouthShape: 'neutral' });
            updates.animations = { ...avatarConfig.animations, emotion: 'neutral' };
        }
        if (lowerCommand.includes('smirk') || lowerCommand.includes('sassy')) {
            updateFace({ mouthShape: 'smirk' });
        }


        // --- ACCESSORIES ---
        const addAccessory = (type: string, style: string, color: string = '#333') => {
            const newAcc = {
                id: `${type}-${Date.now()}`,
                type: type as any,
                style,
                color,
                visible: true
            };
            // Remove existing of same type first
            const existing = (avatarConfig.accessories || []).filter(a => a.type !== type);
            updates.accessories = [...existing, newAcc];
        };

        if (lowerCommand.includes('glasses') || lowerCommand.includes('spectacles')) {
            addAccessory('glasses', 'reading', '#333');
        }
        if (lowerCommand.includes('sunglasses') || lowerCommand.includes('shades')) {
            addAccessory('glasses', 'sunglasses', '#111');
        }
        if (lowerCommand.includes('hat') || lowerCommand.includes('cap')) {
            addAccessory('hat', 'baseball', '#444');
        }
        if (lowerCommand.includes('remove') || lowerCommand.includes('no')) {
            if (lowerCommand.includes('glasses')) updates.accessories = (avatarConfig.accessories || []).filter(a => a.type !== 'glasses');
            if (lowerCommand.includes('hat')) updates.accessories = (avatarConfig.accessories || []).filter(a => a.type !== 'hat');
            if (lowerCommand.includes('beard') || lowerCommand.includes('mustache')) updateFace({ facialHair: 'none' });
        } else {
            // Add logic for adding facial hair only if NOT removing
            if (lowerCommand.includes('beard') || lowerCommand.includes('goatee')) {
                updateFace({ facialHair: 'beard' });
            }
            if (lowerCommand.includes('mustache')) {
                updateFace({ facialHair: 'mustache' });
            }
        }

        return Object.keys(updates).length > 0 ? updates : null;
    };

    const generateUpdateMessage = (updates: Partial<AvatarConfig>): string => {
        const changes: string[] = [];

        if (updates.hair) {
            if (updates.hair.color !== avatarConfig.hair.color) changes.push('hair color');
            if (updates.hair.style !== avatarConfig.hair.style) changes.push('hair style');
        }
        if (updates.face) {
            if (updates.face.skinTone !== avatarConfig.face.skinTone) changes.push('skin tone');
            if (updates.face.eyeColor !== avatarConfig.face.eyeColor) changes.push('eye color');
            if (updates.face.mouthShape !== avatarConfig.face.mouthShape) changes.push('expression');
        }

        // Accessories check is trickier since it's an array, but we can check length
        if (updates.accessories && updates.accessories.length !== (avatarConfig.accessories || []).length) {
            changes.push('accessories');
        }
        if (updates.animations && updates.animations.emotion !== avatarConfig.animations.emotion) {
            changes.push('emotion');
        }

        if (changes.length === 0) return 'Updated avatar configuration.';
        return `Updated: ${changes.join(', ')}`;
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.role === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : message.role === 'system'
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-900 border border-indigo-200'
                                    : 'bg-zinc-100 text-zinc-900'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.avatarUpdate && (
                                <div className="mt-2 pt-2 border-t border-white/20">
                                    <p className="text-xs opacity-80">✨ Avatar updated</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <p className="text-sm text-zinc-600">Processing...</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50">
                <p className="text-xs font-medium text-zinc-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTION_PROMPTS.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(prompt)}
                            className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition-all"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe how to change your avatar..."
                        className="flex-1 px-4 py-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
