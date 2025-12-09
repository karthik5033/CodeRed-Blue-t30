/**
 * Type definitions for AI Builder multi-file generation
 */

export interface FileData {
    name: string;
    content: string;
    type: 'html' | 'css' | 'javascript';
    size?: number;
}

export interface GenerateResponse {
    files: FileData[];
    language?: string;
}

export interface ModifyResponse {
    files: FileData[];
    language?: string;
    original?: FileData[];
}

export interface PageDetection {
    pages: string[]; // e.g., ['landing', 'login', 'signup']
    hasMultiplePages: boolean;
}
