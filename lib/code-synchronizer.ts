import { FileData } from '@/types/ai-builder';
import { PropertyChange } from '@/types/visual-editor';

/**
 * Code synchronizer utility
 * Handles bidirectional sync between visual editor and code
 */
export class CodeSynchronizer {
    /**
     * Apply property change to HTML files
     * Works by applying changes to iframe DOM then extracting HTML
     */
    static applyPropertyChange(
        files: FileData[],
        change: PropertyChange,
        iframeDoc?: Document
    ): FileData[] {
        const htmlFiles = files.filter((f) => f.type === 'html');
        const otherFiles = files.filter((f) => f.type !== 'html');

        const updatedHtmlFiles = htmlFiles.map((file) => {
            // If iframe document is provided, use it directly
            let doc: Document;
            let shouldSerialize = false;

            if (iframeDoc) {
                doc = iframeDoc;
            } else {
                // Fallback to parsing
                const parser = new DOMParser();
                doc = parser.parseFromString(file.content, 'text/html');
                shouldSerialize = true;
            }

            // Find element by path
            const element = this.findElementByPath(doc, change.elementPath);
            if (!element) {
                console.error('Element not found:', change.elementPath);
                console.log('Document body:', doc.body?.innerHTML?.substring(0, 300));
                return file;
            }

            // Update inline style
            this.updateElementStyle(element, change.property, change.value);

            // If we parsed a new document, serialize it back
            if (shouldSerialize) {
                const serializer = new XMLSerializer();
                const updatedContent = serializer.serializeToString(doc);
                return {
                    ...file,
                    content: this.formatHTML(updatedContent),
                };
            } else {
                // Extract HTML from iframe
                return {
                    ...file,
                    content: this.extractHTMLFromIframe(doc),
                };
            }
        });

        return [...updatedHtmlFiles, ...otherFiles];
    }

    /**
     * Extract HTML from iframe document
     * Removes external CSS/JS references to avoid 404 errors
     */
    public static extractHTMLFromIframe(doc: Document): string {
        // Clone the document to avoid modifying the original
        const clone = doc.cloneNode(true) as Document;

        // Remove external stylesheet links
        const links = clone.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => link.remove());

        // Remove external script tags (keep inline scripts)
        const scripts = clone.querySelectorAll('script[src]');
        scripts.forEach(script => script.remove());

        const html = clone.documentElement.outerHTML;
        return this.formatHTML('<!DOCTYPE html>\n' + html);
    }

    /**
     * Find element by CSS selector path
     */
    private static findElementByPath(doc: Document, path: string): Element | null {
        try {
            return doc.querySelector(path);
        } catch (error) {
            console.error('Error finding element:', error);
            return null;
        }
    }

    /**
     * Update element's inline style
     */
    private static updateElementStyle(
        element: Element,
        property: string,
        value: string
    ): void {
        const htmlElement = element as HTMLElement;

        // Convert camelCase to kebab-case for CSS properties
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();

        htmlElement.style.setProperty(cssProperty, value);
    }

    /**
     * Format HTML for better readability
     */
    private static formatHTML(html: string): string {
        // Basic formatting - remove XML declaration if present
        let formatted = html.replace(/<\?xml[^?]*\?>/g, '');

        // Ensure DOCTYPE
        if (!formatted.includes('<!DOCTYPE')) {
            formatted = '<!DOCTYPE html>\n' + formatted;
        }

        return formatted;
    }

    /**
     * Update text content of an element
     */
    static updateTextContent(
        files: FileData[],
        elementPath: string,
        textContent: string,
        iframeDoc?: Document
    ): FileData[] {
        const htmlFiles = files.filter((f) => f.type === 'html');
        const otherFiles = files.filter((f) => f.type !== 'html');

        const updatedHtmlFiles = htmlFiles.map((file) => {
            let doc: Document;
            let shouldSerialize = false;

            if (iframeDoc) {
                doc = iframeDoc;
            } else {
                const parser = new DOMParser();
                doc = parser.parseFromString(file.content, 'text/html');
                shouldSerialize = true;
            }

            const element = this.findElementByPath(doc, elementPath);
            if (!element) return file;

            element.textContent = textContent;

            if (shouldSerialize) {
                const serializer = new XMLSerializer();
                const updatedContent = serializer.serializeToString(doc);
                return {
                    ...file,
                    content: this.formatHTML(updatedContent),
                };
            } else {
                return {
                    ...file,
                    content: this.extractHTMLFromIframe(doc),
                };
            }
        });

        return [...updatedHtmlFiles, ...otherFiles];
    }
}

