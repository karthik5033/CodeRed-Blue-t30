/**
 * Project structure organization utilities
 */

import { FileData, ProjectStructure, ProjectType, ProjectMetadata } from '@/types/ai-builder';

/**
 * Detect project type from files
 */
export function detectProjectType(files: FileData[]): ProjectMetadata {
    // No React support - all frontend is HTML/CSS/JS
    const hasReact = false;

    const hasBackend = files.some(f =>
        f.category === 'backend' ||
        f.content.includes('express') ||
        f.content.includes('app.listen') ||
        f.path.includes('server') ||
        f.path.includes('backend')
    );

    const hasDatabase = files.some(f =>
        f.category === 'database' ||
        f.content.includes('mongoose') ||
        f.content.includes('prisma') ||
        f.content.includes('Schema') ||
        f.path.includes('models') ||
        f.path.includes('schema')
    );

    let databaseType: 'mongodb' | 'postgresql' | 'mysql' | undefined;
    if (hasDatabase) {
        if (files.some(f => f.content.includes('mongoose') || f.content.includes('mongodb'))) {
            databaseType = 'mongodb';
        } else if (files.some(f => f.content.includes('pg') || f.content.includes('postgresql'))) {
            databaseType = 'postgresql';
        } else if (files.some(f => f.content.includes('mysql'))) {
            databaseType = 'mysql';
        }
    }

    let type: ProjectType = 'frontend-only';
    if (hasBackend && hasDatabase) {
        type = 'fullstack';
    } else if (hasBackend) {
        type = 'backend-only';
    }

    return {
        type,
        hasDatabase,
        databaseType,
        hasReact: false, // Never React
        hasBackend,
    };
}

/**
 * Create project structure from files
 */
export function createProjectStructure(files: FileData[]): ProjectStructure {
    const root: ProjectStructure = {
        name: 'project',
        type: 'folder',
        path: '',
        children: [],
    };

    // Sort files by path to ensure parent folders are created first
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

    for (const file of sortedFiles) {
        addFileToStructure(root, file);
    }

    return root;
}

/**
 * Add a file to the project structure tree
 */
function addFileToStructure(root: ProjectStructure, file: FileData): void {
    const parts = file.path.split('/').filter(p => p);
    let current = root;

    // Navigate/create folder structure
    for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        let folder = current.children?.find(c => c.name === folderName && c.type === 'folder');

        if (!folder) {
            folder = {
                name: folderName,
                type: 'folder',
                path: parts.slice(0, i + 1).join('/'),
                children: [],
            };
            current.children = current.children || [];
            current.children.push(folder);
        }

        current = folder;
    }

    // Add the file
    const fileName = parts[parts.length - 1];
    current.children = current.children || [];
    current.children.push({
        name: fileName,
        type: 'file',
        path: file.path,
        file,
    });
}

/**
 * Generate package.json for frontend (simple HTTP server)
 */
export function generateFrontendPackageJson(): string {
    return JSON.stringify({
        name: 'frontend',
        version: '1.0.0',
        scripts: {
            start: 'npx http-server . -p 3000',
        },
        devDependencies: {
            'http-server': '^14.1.1',
        },
    }, null, 2);
}

/**
 * Generate package.json for backend
 */
export function generateBackendPackageJson(databaseType?: 'mongodb' | 'postgresql' | 'mysql'): string {
    const dependencies: Record<string, string> = {
        express: '^4.18.2',
        cors: '^2.8.5',
        dotenv: '^16.3.1',
        'body-parser': '^1.20.2',
    };

    if (databaseType === 'mongodb') {
        dependencies.mongoose = '^8.0.0';
    } else if (databaseType === 'postgresql') {
        dependencies['@prisma/client'] = '^5.7.0';
        dependencies.pg = '^8.11.3';
    } else if (databaseType === 'mysql') {
        dependencies.mysql2 = '^3.6.5';
    }

    return JSON.stringify({
        name: 'backend',
        version: '1.0.0',
        type: 'module',
        scripts: {
            start: 'node src/index.js',
            dev: 'nodemon src/index.js',
        },
        dependencies,
        devDependencies: {
            nodemon: '^3.0.2',
        },
    }, null, 2);
}

/**
 * Generate .env template
 */
export function generateEnvTemplate(databaseType?: 'mongodb' | 'postgresql' | 'mysql'): string {
    const lines = ['PORT=5000', ''];

    if (databaseType === 'mongodb') {
        lines.push('# MongoDB Connection');
        lines.push('MONGODB_URI=mongodb://localhost:27017/myapp');
        lines.push('');
    } else if (databaseType === 'postgresql') {
        lines.push('# PostgreSQL Connection');
        lines.push('DATABASE_URL=postgresql://user:password@localhost:5432/myapp');
        lines.push('');
    } else if (databaseType === 'mysql') {
        lines.push('# MySQL Connection');
        lines.push('DATABASE_URL=mysql://user:password@localhost:3306/myapp');
        lines.push('');
    }

    lines.push('# JWT Secret (generate a random string)');
    lines.push('JWT_SECRET=your-secret-key-here');

    return lines.join('\n');
}

/**
 * Generate README.md
 */
export function generateReadme(metadata: ProjectMetadata): string {
    const lines = ['# Generated Project', '', '## Project Structure', ''];

    if (metadata.type === 'fullstack') {
        lines.push('This is a full-stack application with:');
        lines.push('- **Frontend**: HTML/CSS/JavaScript');
        lines.push('- **Backend**: Express.js');
        if (metadata.hasDatabase) {
            lines.push('- **Database**: ' + (metadata.databaseType || 'Database'));
        }
        lines.push('');
        lines.push('## Setup Instructions');
        lines.push('');
        lines.push('### Backend Setup');
        lines.push('```bash');
        lines.push('cd backend');
        lines.push('npm install');
        lines.push('cp .env.example .env');
        lines.push('# Edit .env with your database credentials');
        lines.push('npm run dev');
        lines.push('```');
        lines.push('');
        lines.push('### Frontend Setup');
        lines.push('Open `frontend/index.html` in your browser or use a local server:');
        lines.push('```bash');
        lines.push('cd frontend');
        lines.push('npx http-server . -p 3000');
        lines.push('```');
    } else if (metadata.type === 'backend-only') {
        lines.push('This is a backend API application.');
        lines.push('');
        lines.push('## Setup Instructions');
        lines.push('```bash');
        lines.push('npm install');
        lines.push('cp .env.example .env');
        lines.push('# Edit .env with your configuration');
        lines.push('npm run dev');
        lines.push('```');
    } else {
        lines.push('This is a frontend application.');
        lines.push('');
        lines.push('## Setup Instructions');
        lines.push('Open `index.html` in your browser or use a local server:');
        lines.push('```bash');
        lines.push('npx http-server . -p 3000');
        lines.push('```');
    }

    lines.push('');
    lines.push('## Features');
    lines.push('- Modern, responsive design');
    lines.push('- Vanilla JavaScript for interactivity');
    if (metadata.hasBackend) {
        lines.push('- RESTful API endpoints');
    }
    if (metadata.hasDatabase) {
        lines.push('- Database integration');
    }

    return lines.join('\n');
}

/**
 * Generate Vite config for React projects
 */
export function generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})`;
}

/**
 * Generate Tailwind config
 */
export function generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

/**
 * Flatten project structure to get all files
 */
export function flattenStructure(structure: ProjectStructure): FileData[] {
    const files: FileData[] = [];

    function traverse(node: ProjectStructure) {
        if (node.type === 'file' && node.file) {
            files.push(node.file);
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }

    traverse(structure);
    return files;
}
