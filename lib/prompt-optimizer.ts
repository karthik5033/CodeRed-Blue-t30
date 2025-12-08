/**
 * Prompt optimization utility to minimize token usage
 * Compresses verbose user prompts while preserving intent
 */

export function optimizePrompt(userPrompt: string): string {
    let optimized = userPrompt.trim();

    // Remove common filler words
    const fillerWords = [
        'please', 'could you', 'can you', 'i want', 'i need', 'i would like',
        'make me', 'create me', 'build me', 'give me', 'show me',
        'very', 'really', 'quite', 'just', 'actually', 'basically',
    ];

    fillerWords.forEach(filler => {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        optimized = optimized.replace(regex, '');
    });

    // Compress common phrases
    const compressions: Record<string, string> = {
        'landing page': 'LP',
        'hero section': 'hero',
        'call to action': 'CTA',
        'contact form': 'contact',
        'navigation bar': 'nav',
        'footer section': 'footer',
        'testimonials': 'testimonial',
        'pricing table': 'pricing',
        'feature section': 'features',
        'about us': 'about',
        'modern design': 'modern',
        'responsive': 'responsive',
        'mobile friendly': 'mobile',
        'dark mode': 'dark',
        'light mode': 'light',
    };

    Object.entries(compressions).forEach(([long, short]) => {
        const regex = new RegExp(long, 'gi');
        optimized = optimized.replace(regex, short);
    });

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();

    return optimized;
}

export function estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
}

export function getOptimizationStats(original: string, optimized: string) {
    const originalTokens = estimateTokens(original);
    const optimizedTokens = estimateTokens(optimized);
    const saved = originalTokens - optimizedTokens;
    const percentage = Math.round((saved / originalTokens) * 100);

    return {
        originalTokens,
        optimizedTokens,
        tokensSaved: saved,
        percentageSaved: percentage,
    };
}
