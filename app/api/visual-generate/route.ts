import { NextRequest, NextResponse } from 'next/server';
import { Project, Page, VisualElement } from '@/lib/visual-builder-types';
import { generateFunctionalLoginPage, generateFunctionalSignupPage } from './helpers';

interface FileStructure {
    path: string;
    content: string;
    type: 'frontend' | 'backend' | 'config';
}

// Generate Next.js page component from visual elements
function generatePageComponent(page: Page, pagePath: string): string {
    // Step 1: Remove non-alphanumeric characters
    const sanitized = page.name.replace(/[^a-zA-Z0-9]/g, '');
    console.log('[Visual Generate] Step 1 - Sanitized:', page.name, '->', sanitized);

    // Step 2: Capitalize first letter
    let pageName = sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
    console.log('[Visual Generate] Step 2 - Capitalized:', pageName);

    // Step 3: Remove 'page' or 'Page' suffix if it exists
    if (pageName.toLowerCase().endsWith('page')) {
        const before = pageName;
        pageName = pageName.slice(0, -4);
        console.log('[Visual Generate] Step 3 - Stripped suffix:', before, '->', pageName);
    }

    const finalName = `${pageName}Page`;
    console.log('[Visual Generate] FINAL FUNCTION NAME:', finalName);

    // Detect login/signup pages and generate functional versions
    const isLoginPage = page.name.toLowerCase().includes('login');
    const isSignupPage = page.name.toLowerCase().includes('sign') && !isLoginPage;
    if (isLoginPage) return generateFunctionalLoginPage(pageName);
    if (isSignupPage) return generateFunctionalSignupPage(pageName);

    // Landing page with sections
    if (page.type === 'landing' && page.sections) {
        const sectionsCode = page.sections.map(section => {
            const elementsCode = generateElementsJSX(section.elements);
            return `            <section id="${section.id}" className="min-h-screen py-20 px-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    ${elementsCode}
                </div>
            </section>`;
        }).join('\n');

        return `'use client';

export default function ${pageName}Page() {
    return (
        <div className="min-h-screen bg-gray-50">
${sectionsCode}
        </div>
    );
}
`;
    }

    // Regular page (Home page with enhanced styling)
    const elementsCode = generateElementsJSX(page.elements);
    const isHomePage = page.id.toLowerCase() === 'home' || page.name.toLowerCase() === 'home';

    if (isHomePage) {
        // Enhanced home page with hero section
        return `'use client';

export default function ${pageName}Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center space-y-8">
                        ${elementsCode}
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                </div>
            </div>
        </div>
    );
}
`;
    }

    // Regular non-home pages
    return `'use client';

export default function ${pageName}Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    ${elementsCode}
                </div>
            </div>
        </div>
    );
}
`;
}

// Generate JSX for elements with proper layout (no absolute positioning)
function generateElementsJSX(elements: VisualElement[]): string {
    return elements.map(element => {
        const styles = element.styles || {};

        // Build style object without position/left/top
        const cleanStyles: Record<string, string> = {};
        Object.entries(styles).forEach(([key, value]) => {
            // Skip position-related properties
            if (!['position', 'left', 'top', 'right', 'bottom'].includes(key) && value) {
                cleanStyles[key] = value;
            }
        });

        // Convert size to proper CSS
        const width = typeof element.size.width === 'number'
            ? `${element.size.width}px`
            : element.size.width;
        const height = typeof element.size.height === 'number'
            ? `${element.size.height}px`
            : element.size.height;

        // Add dimensions to styles
        if (element.type !== 'navbar') { // Some elements like navbar should be full-width
            cleanStyles.width = width;
            if (height && height !== 'auto') {
                cleanStyles.minHeight = height;
            }
        }

        const styleStr = Object.entries(cleanStyles)
            .map(([key, value]) => `${key}: '${value}'`)
            .join(', ');
        const fullStyle = styleStr ? `style={{ ${styleStr} }}` : '';

        switch (element.type) {
            case 'heading':
                const level = element.properties.level || '1';
                return `<h${level} ${fullStyle} className="text-3xl font-bold text-gray-900">${element.properties.text || 'Heading'}</h${level}>`;
            case 'paragraph':
            case 'text':
                return `<p ${fullStyle} className="text-gray-700">${element.properties.text || 'Text'}</p>`;
            case 'button':
                return `<button ${fullStyle} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">${element.properties.label || 'Button'}</button>`;
            case 'input':
                return `<input type="text" placeholder="${element.properties.placeholder || ''}" ${fullStyle} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />`;
            case 'textarea':
                return `<textarea placeholder="${element.properties.placeholder || ''}" ${fullStyle} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">\u003c/textarea>`;
            case 'card':
                return `<div ${fullStyle} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">${element.properties.title || 'Card Title'}</h3>
                    <p className="text-gray-600">${element.properties.text || 'Card content'}</p>
                </div>`;
            case 'navbar':
                const items = (element.properties.items || []) as any[];
                return `<nav ${fullStyle} className="w-full bg-white shadow-sm px-6 py-4">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="text-xl font-bold text-gray-900">Logo</div>
                        <div className="flex gap-6">
                            ${items.map((item: any) => `<a href="${item.href || '#'}" className="text-gray-700 hover:text-blue-600 transition-colors">${item.label || 'Link'}</a>`).join('\n                            ')}
                        </div>
                    </div>
                </nav>`;
            case 'checkbox':
                return `<label ${fullStyle} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                    ${element.properties.label || 'Checkbox'}
                </label>`;
            case 'image':
                return `<img src="${element.properties.src || '/placeholder.png'}" alt="${element.properties.alt || 'Image'}" ${fullStyle} className="rounded-lg" />`;
            case 'avatar':
                return `<div ${fullStyle} className="rounded-full bg-gray-200 flex items-center justify-center">\u003c/div>`;
            case 'progress':
                const value = parseFloat(String(element.properties.value || '50'));
                const max = parseFloat(String(element.properties.max || '100'));
                return `<div ${fullStyle} className="w-full bg-gray-200 rounded-full overflow-hidden">
                    <div style={{ width: '${(value / max) * 100}%' }} className="h-full bg-blue-600">\u003c/div>
                </div>`;
            default:
                return `<div ${fullStyle} className="bg-gray-100 rounded p-4">
                    <span className="text-sm text-gray-500">{/* ${element.type} */}</span>
                </div>`;
        }
    }).join('\n                ');
}

// Generate auth API routes
function generateAuthLoginRoute(): string {
    return `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        // TODO: Implement actual authentication logic
        // 1. Validate credentials against database
        // 2. Hash password and compare
        // 3. Generate JWT token
        // 4. Set secure HTTP-only cookie
        
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password required' },
                { status: 400 }
            );
        }
        
        // Placeholder successful response
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: { email }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}
`;
}

function generateAuthSignupRoute(): string {
    return `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        
        // TODO: Implement actual signup logic
        // 1. Validate input (email format, password strength)
        // 2. Check if user already exists
        // 3. Hash password with bcrypt
        // 4. Create user record in database
        // 5. Send verification email
        
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'All fields required' },
                { status: 400 }
            );
        }
        
        // Placeholder successful response
        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: { name, email }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Signup failed' },
            { status: 500 }
        );
    }
}
`;
}

function generateAuthLogoutRoute(): string {
    return `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // TODO: Implement logout logic
    // 1. Clear session cookie
    // 2. Invalidate session token in database
    // 3. Optional: Log logout event for security
    
    return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
    });
}
`;
}

// Generate package.json
function generatePackageJson(projectName: string): string {
    return `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^10.0.1"
  }
}
`;
}

// Generate tailwind config
function generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
}

// Generate .env.example
function generateEnvExample(): string {
    return `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-secret-key-here-min-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# API Keys (optional)
# Add your API keys here if needed
`;
}

// Generate README
function generateReadme(projectName: string): string {
    return `# ${projectName}

Generated by Visual Builder

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your actual values
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- \`app/\` - Next.js app directory with pages
- \`app/api/\` - API routes for backend functionality
- \`components/\` - Reusable React components
- \`lib/\` - Utility functions and helpers

## TODO

- [ ] Implement authentication logic in API routes
- [ ] Set up database connection
- [ ] Add form validation
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Connect frontend forms to backend APIs

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
`;
}

// Utility function
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Helper function to safely get all elements from a page (handles both regular and landing pages)
function getAllElements(page: Page): VisualElement[] {
    if (page.type === 'landing' && page.sections) {
        return page.sections.flatMap(section => section.elements || []);
    }
    return page.elements || [];
}

export async function POST(request: NextRequest) {
    try {
        const { project } = await request.json() as { project: Project };

        if (!project || !project.pages) {
            return NextResponse.json(
                { error: 'Invalid project data' },
                { status: 400 }
            );
        }

        const files: FileStructure[] = [];

        // Generate frontend pages
        for (const page of project.pages) {
            // Normalize page ID for routing
            const pageId = page.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            const isHomePage = pageId === 'home' || project.pages.indexOf(page) === 0;
            const pagePath = isHomePage ? '' : `/${pageId}`;
            const filePath = pagePath === '' ? 'app/page.tsx' : `app${pagePath}/page.tsx`;

            files.push({
                path: filePath,
                content: generatePageComponent(page, pagePath),
                type: 'frontend'
            });
        }

        // Detect auth pages
        const hasLogin = project.pages.some(p => p.name.toLowerCase().includes('login'));
        const hasSignup = project.pages.some(p => p.name.toLowerCase().includes('sign'));
        const hasForms = project.pages.some(p => {
            const elements = getAllElements(p);
            return elements.some(e => ['input', 'textarea', 'form'].includes(e.type));
        });

        // Generate backend auth routes if auth pages exist
        if (hasLogin) {
            files.push({
                path: 'app/api/auth/login/route.ts',
                content: generateAuthLoginRoute(),
                type: 'backend'
            });
        }

        if (hasSignup) {
            files.push({
                path: 'app/api/auth/signup/route.ts',
                content: generateAuthSignupRoute(),
                type: 'backend'
            });
        }

        if (hasLogin || hasSignup) {
            files.push({
                path: 'app/api/auth/logout/route.ts',
                content: generateAuthLogoutRoute(),
                type: 'backend'
            });
        }

        // Generate config files
        files.push({
            path: 'package.json',
            content: generatePackageJson(project.name),
            type: 'config'
        });

        files.push({
            path: 'tailwind.config.js',
            content: generateTailwindConfig(),
            type: 'config'
        });

        files.push({
            path: '.env.example',
            content: generateEnvExample(),
            type: 'config'
        });

        files.push({
            path: 'README.md',
            content: generateReadme(project.name),
            type: 'config'
        });

        console.log(`[Visual Generate] Generated ${files.length} files for project: ${project.name}`);
        console.log(`[Visual Generate] Pages: ${project.pages.map(p => p.name).join(', ')}`);
        console.log(`[Visual Generate] Auth detected: ${hasLogin || hasSignup}`);

        return NextResponse.json({ files });
    } catch (error: any) {
        console.error('[Visual Generate] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate code' },
            { status: 500 }
        );
    }
}
