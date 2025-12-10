import { SelectedElement } from '@/types/visual-editor';

/**
 * Element selector utility for iframe
 * Injects selection capabilities into the preview iframe
 */
export class ElementSelector {
    private iframe: HTMLIFrameElement;
    private onSelect: (element: SelectedElement | null) => void;
    private selectedElement: HTMLElement | null = null;
    private overlay: HTMLDivElement | null = null;

    constructor(iframe: HTMLIFrameElement, onSelect: (element: SelectedElement | null) => void) {
        this.iframe = iframe;
        this.onSelect = onSelect;
    }

    /**
     * Enable element selection mode
     */
    enable() {
        const iframeDoc = this.iframe.contentDocument;
        if (!iframeDoc || !iframeDoc.body) return;

        // Create selection overlay
        this.createOverlay(iframeDoc);

        // Add click listener to all elements
        iframeDoc.addEventListener('click', this.handleClick, true);
        iframeDoc.addEventListener('mouseover', this.handleHover, true);
        iframeDoc.addEventListener('mouseout', this.handleMouseOut, true);

        // Add cursor style
        iframeDoc.body.style.cursor = 'crosshair';
    }

    /**
     * Disable element selection mode
     */
    disable() {
        const iframeDoc = this.iframe.contentDocument;
        if (!iframeDoc || !iframeDoc.body) return;

        iframeDoc.removeEventListener('click', this.handleClick, true);
        iframeDoc.removeEventListener('mouseover', this.handleHover, true);
        iframeDoc.removeEventListener('mouseout', this.handleMouseOut, true);
        iframeDoc.body.style.cursor = '';

        this.removeOverlay();
        this.selectedElement = null;
    }

    /**
     * Handle element click
     */
    private handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLElement;
        if (!target || target === this.overlay) return;

        this.selectElement(target);
    };

    /**
     * Handle element hover
     */
    private handleHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target || target === this.overlay || target === this.selectedElement) return;

        this.highlightElement(target, 'hover');
    };

    /**
     * Handle mouse out
     */
    private handleMouseOut = () => {
        if (this.selectedElement) {
            this.highlightElement(this.selectedElement, 'selected');
        } else {
            this.removeOverlay();
        }
    };

    /**
     * Select an element
     */
    private selectElement(element: HTMLElement) {
        this.selectedElement = element;
        this.highlightElement(element, 'selected');

        const elementData = this.extractElementData(element);
        this.onSelect(elementData);
    }

    /**
     * Highlight element with overlay
     */
    private highlightElement(element: HTMLElement, mode: 'hover' | 'selected') {
        if (!this.overlay) return;

        const rect = element.getBoundingClientRect();
        const iframeDoc = this.iframe.contentDocument!;
        const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
        const scrollLeft = iframeDoc.documentElement.scrollLeft || iframeDoc.body.scrollLeft;

        this.overlay.style.display = 'block';
        this.overlay.style.top = `${rect.top + scrollTop}px`;
        this.overlay.style.left = `${rect.left + scrollLeft}px`;
        this.overlay.style.width = `${rect.width}px`;
        this.overlay.style.height = `${rect.height}px`;

        if (mode === 'selected') {
            this.overlay.style.border = '2px solid #3b82f6';
            this.overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        } else {
            this.overlay.style.border = '1px dashed #3b82f6';
            this.overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
        }
    }

    /**
     * Create selection overlay element
     */
    private createOverlay(doc: Document) {
        this.overlay = doc.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.pointerEvents = 'none';
        this.overlay.style.zIndex = '999999';
        this.overlay.style.display = 'none';
        this.overlay.style.boxSizing = 'border-box';
        doc.body.appendChild(this.overlay);
    }

    /**
     * Remove selection overlay
     */
    private removeOverlay() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    /**
     * Extract element data
     */
    private extractElementData(element: HTMLElement): SelectedElement {
        const iframeDoc = this.iframe.contentDocument!;
        const computedStyle = iframeDoc.defaultView!.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        // Get CSS path
        const path = this.getElementPath(element);

        // Extract inline styles
        const inlineStyles: Record<string, string> = {};
        if (element.style.length > 0) {
            for (let i = 0; i < element.style.length; i++) {
                const prop = element.style[i];
                inlineStyles[prop] = element.style.getPropertyValue(prop);
            }
        }

        return {
            path,
            tagName: element.tagName.toLowerCase(),
            className: element.className,
            id: element.id,
            textContent: element.textContent || '',
            innerHTML: element.innerHTML,
            computedStyles: {
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                fontSize: computedStyle.fontSize,
                fontFamily: computedStyle.fontFamily,
                fontWeight: computedStyle.fontWeight,
                margin: computedStyle.margin,
                padding: computedStyle.padding,
                width: computedStyle.width,
                height: computedStyle.height,
                display: computedStyle.display,
                borderColor: computedStyle.borderColor,
                borderWidth: computedStyle.borderWidth,
                borderRadius: computedStyle.borderRadius,
                // Add image-specific attributes
                ...(element.tagName.toLowerCase() === 'img' && {
                    src: (element as HTMLImageElement).src,
                    alt: (element as HTMLImageElement).alt,
                }),
            },
            inlineStyles,
            rect: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            },
        };
    }

    /**
     * Get CSS selector path for element
     * Generates a robust selector using element structure
     */
    private getElementPath(element: HTMLElement): string {
        // If element has an ID, use it (most reliable)
        if (element.id) {
            return `#${element.id}`;
        }

        // Build path from root to element
        const path: string[] = [];
        let current: HTMLElement | null = element;

        while (current && current !== current.ownerDocument.body) {
            let selector = current.tagName.toLowerCase();

            // Add class if available
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\s+/).filter(c => c);
                if (classes.length > 0) {
                    // Use first class for selector
                    selector += `.${classes[0].replace(/[^a-zA-Z0-9_-]/g, '')}`;
                }
            }

            // Add nth-child if needed for uniqueness
            if (current.parentElement) {
                const siblings = Array.from(current.parentElement.children);
                const sameTagSiblings = siblings.filter(
                    s => s.tagName === current!.tagName
                );

                if (sameTagSiblings.length > 1) {
                    const index = sameTagSiblings.indexOf(current) + 1;
                    selector += `:nth-of-type(${index})`;
                }
            }

            path.unshift(selector);
            current = current.parentElement;
        }

        // Add body to path if needed
        if (path.length === 0) {
            return 'body';
        }

        return 'body > ' + path.join(' > ');
    }
}
