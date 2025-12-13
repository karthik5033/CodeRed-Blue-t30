/**
 * Avatar Builder Type Definitions
 */

export interface FaceConfig {
    skinTone: string;
    eyeColor: string;
    eyeShape: 'round' | 'almond' | 'wide' | 'narrow';
    eyeSize: number; // 0-100
    noseSize: number; // 0-100
    noseShape: 'small' | 'medium' | 'large' | 'button';
    mouthShape: 'smile' | 'neutral' | 'frown' | 'smirk';
    mouthSize: number; // 0-100
    cheekboneHeight: number; // 0-100
    jawShape: 'round' | 'square' | 'oval' | 'heart';
    facialHair?: 'none' | 'beard' | 'mustache';
}

export interface HairConfig {
    style: 'short' | 'medium' | 'long' | 'curly' | 'straight' | 'wavy' | 'bald' | 'buzz' | 'ponytail' | 'bun' | 'mohawk';
    color: string;
    length: number; // 0-100
    volume: number; // 0-100
}

export interface AccessoryConfig {
    id: string;
    type: 'glasses' | 'hat' | 'earrings' | 'necklace' | 'mask';
    style: string;
    color: string;
    visible: boolean;
}

export interface BodyConfig {
    build: 'slim' | 'average' | 'athletic' | 'heavy';
    height: number; // 0-100
    shoulderWidth: number; // 0-100
}

export interface VoiceConfig {
    voice: string; // voice ID
    pitch: number; // 0-200, 100 is normal
    speed: number; // 0.5-2.0
    volume: number; // 0-100
}

export interface AnimationConfig {
    idle: string;
    talking: string;
    gesture: string;
    emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';
}

export interface AvatarConfig {
    id: string;
    name: string;
    face: FaceConfig;
    hair: HairConfig;
    accessories: AccessoryConfig[];
    body: BodyConfig;
    voice: VoiceConfig;
    animations: AnimationConfig;
    createdAt: string;
    updatedAt: string;
}

export interface AvatarPreset {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    config: Partial<AvatarConfig>;
    category: 'professional' | 'casual' | 'fantasy' | 'cartoon' | 'realistic';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    avatarUpdate?: Partial<AvatarConfig>;
}

export interface AvatarModificationCommand {
    command: string;
    currentConfig: AvatarConfig;
}

export interface AvatarModificationResponse {
    success: boolean;
    updatedConfig: Partial<AvatarConfig>;
    message: string;
    changes: string[];
}
