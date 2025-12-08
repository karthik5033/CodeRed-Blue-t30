/**
 * Code parsing utilities for extracting and validating generated code
 */

export function extractCodeFromResponse(response: string): {
    code: string;
    language: string;
} {
    // Try to extract code from markdown code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [...response.matchAll(codeBlockRegex)];

    if (matches.length > 0) {
        // Get the last code block (usually the main component)
        const lastMatch = matches[matches.length - 1];
        return {
            language: lastMatch[1] || 'tsx',
            code: lastMatch[2].trim(),
        };
    }

    // If no code block found, return the entire response
    return {
        language: 'tsx',
        code: response.trim(),
    };
}

export function validateTypeScriptCode(code: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Basic validation checks
    if (!code.includes('export default')) {
        errors.push('Missing default export');
    }

    // Check for common syntax errors
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push('Mismatched braces');
    }

    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push('Mismatched parentheses');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function transformCodeForPreview(code: string): string {
    // Remove "use client" directive for iframe preview
    let transformed = code.replace(/['"]use client['"];?\n?/g, '');

    // Ensure the component is exported
    if (!transformed.includes('export default')) {
        // Try to find the main component and add export
        const componentMatch = transformed.match(/(?:function|const)\s+(\w+)/);
        if (componentMatch) {
            transformed += `\n\nexport default ${componentMatch[1]};`;
        }
    }

    return transformed;
}

export function formatCodeForDisplay(code: string): string {
    // Basic code formatting (you can enhance this with prettier later)
    return code.trim();
}

export function extractImports(code: string): string[] {
    const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(code)) !== null) {
        imports.push(match[1]);
    }

    return imports;
}

export function getComponentName(code: string): string | null {
    // Try to extract component name from export default
    const exportMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
    if (exportMatch) {
        return exportMatch[1];
    }

    // Try to find function or const component
    const componentMatch = code.match(/(?:function|const)\s+(\w+)/);
    return componentMatch ? componentMatch[1] : null;
}
