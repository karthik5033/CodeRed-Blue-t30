/**
 * Visual Builder Type Definitions
 * Comprehensive type system for premium visual page builder
 */

// ============= ELEMENT TYPES =============

export type BasicElementType =
    | 'text'
    | 'heading'
    | 'paragraph'
    | 'button'
    | 'link'
    | 'icon'
    | 'divider'
    | 'spacer';

export type LayoutElementType =
    | 'container'
    | 'section'
    | 'grid'
    | 'flex'
    | 'row'
    | 'column';

export type NavigationElementType =
    | 'navbar'
    | 'footer'
    | 'sidebar'
    | 'breadcrumb'
    | 'menu'
    | 'tabs';

export type FormElementType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'form'
    | 'label';

export type ContentElementType =
    | 'card'
    | 'table'
    | 'list'
    | 'accordion'
    | 'collapse'
    | 'badge'
    | 'tag';

export type MediaElementType =
    | 'image'
    | 'video'
    | 'gallery'
    | 'carousel'
    | 'avatar'
    | 'logo';

export type InteractiveElementType =
    | 'modal'
    | 'dropdown'
    | 'tooltip'
    | 'alert'
    | 'toast'
    | 'popover';

export type AdvancedElementType =
    | 'chart'
    | 'progress'
    | 'calendar'
    | 'map'
    | 'timeline'
    | 'stats';

export type ElementType =
    | BasicElementType
    | LayoutElementType
    | NavigationElementType
    | FormElementType
    | ContentElementType
    | MediaElementType
    | InteractiveElementType
    | AdvancedElementType;

export type ElementCategory =
    | 'basic'
    | 'layout'
    | 'navigation'
    | 'forms'
    | 'content'
    | 'media'
    | 'interactive'
    | 'advanced';

// ============= ELEMENT INTERFACES =============

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number | string;
    height: number | string;
}

export interface ElementStyles {
    // Layout
    display?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;

    // Spacing
    margin?: string;
    padding?: string;

    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    textAlign?: string;
    color?: string;

    // Background
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;

    // Border
    border?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;

    // Effects
    boxShadow?: string;
    opacity?: string;
    transform?: string;

    // Flexbox/Grid
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    gridTemplateColumns?: string;

    // Other
    cursor?: string;
    overflow?: string;
    zIndex?: string;
    [key: string]: string | undefined;
}

export interface ElementProperties {
    // Text elements
    text?: string;
    placeholder?: string;

    // Button elements
    label?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

    // Link elements
    href?: string;
    target?: '_blank' | '_self';

    // Image/Video elements
    src?: string;
    alt?: string;

    // Form elements
    name?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;

    // Icon elements
    icon?: string;

    // Container elements
    children?: string[];

    // Navigation
    items?: Array<{ label: string; href: string }>;

    // Advanced
    data?: any;
    config?: Record<string, any>;

    [key: string]: any;
}

export interface VisualElement {
    id: string;
    type: ElementType;
    category: ElementCategory;
    position: Position;
    size: Size;
    properties: ElementProperties;
    styles: ElementStyles;
    parentId?: string;
    children?: string[];
    locked?: boolean;
    hidden?: boolean;
}

// ============= PAGE & PROJECT =============

export interface PageSection {
    id: string;
    name: string;
    elements: VisualElement[];
}

export type PageType = 'landing' | 'page';

export interface Page {
    id: string;
    name: string;
    type?: PageType; // 'landing' for section-based, 'page' for regular
    elements: VisualElement[]; // For regular pages
    sections?: PageSection[]; // For landing pages with sections
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    name: string;
    pages: Page[];
    currentPageId: string;
    theme?: {
        colors: Record<string, string>;
        fonts: Record<string, string>;
    };
}

// ============= UI STATE =============

export interface CanvasState {
    zoom: number;
    pan: Position;
    selectedElementIds: string[];
    hoveredElementId?: string;
    isDragging: boolean;
    isResizing: boolean;
}

export interface HistoryState {
    past: Page[];
    present: Page;
    future: Page[];
}

// ============= ELEMENT TEMPLATES =============

export interface ElementTemplate {
    type: ElementType;
    category: ElementCategory;
    name: string;
    icon: string;
    description: string;
    defaultProperties: ElementProperties;
    defaultStyles: ElementStyles;
    defaultSize: Size;
}

// ============= CODE GENERATION =============

export interface GeneratedCode {
    html: string;
    css: string;
    javascript: string;
    backend?: {
        routes: string;
        models: string;
    };
}
