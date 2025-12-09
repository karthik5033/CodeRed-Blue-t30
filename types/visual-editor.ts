export interface SelectedElement {
    path: string; // CSS selector path
    tagName: string;
    className: string;
    id: string;
    textContent: string;
    innerHTML: string;
    computedStyles: {
        color?: string;
        backgroundColor?: string;
        fontSize?: string;
        fontFamily?: string;
        fontWeight?: string;
        margin?: string;
        padding?: string;
        width?: string;
        height?: string;
        display?: string;
        borderColor?: string;
        borderWidth?: string;
        borderRadius?: string;
        // Image-specific attributes
        src?: string;
        alt?: string;
    };
    inlineStyles: Record<string, string>;
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

export interface PropertyChange {
    elementPath: string;
    property: string;
    value: string;
}

export type EditorMode = 'visual' | 'code';
