/**
 * Type definitions for AI Builder multi-file generation
 */

export interface FileData {
    name: string;
    content: string;
    type: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx' | 'json' | 'env' | 'markdown' | 'text';
    category: 'frontend' | 'backend' | 'database' | 'config' | 'docs';
    path: string; // Relative path in project structure (e.g., 'frontend/src/components/Button.tsx')
    size?: number;
}

export interface ProjectStructure {
    name: string;
    type: 'file' | 'folder';
    path: string;
    children?: ProjectStructure[];
    file?: FileData;
}

export interface GenerateResponse {
    files: FileData[];
    structure: ProjectStructure;
    database?: DatabaseSchema;
    language?: string;
}

export interface ModifyResponse {
    files: FileData[];
    structure: ProjectStructure;
    language?: string;
    original?: FileData[];
}

export interface PageDetection {
    pages: string[]; // e.g., ['landing', 'login', 'signup']
    hasMultiplePages: boolean;
}

// Database Types
export interface DatabaseSchema {
    name: string;
    type: 'mongodb' | 'postgresql' | 'mysql';
    collections?: MongoCollection[];
    tables?: SQLTable[];
}

export interface MongoCollection {
    name: string;
    schema: Record<string, any>;
    indexes?: string[];
}

export interface SQLTable {
    name: string;
    columns: SQLColumn[];
    primaryKey: string;
    foreignKeys?: ForeignKey[];
}

export interface SQLColumn {
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: any;
}

export interface ForeignKey {
    column: string;
    references: {
        table: string;
        column: string;
    };
}

export interface DatabaseConfig {
    type: 'mongodb' | 'postgresql' | 'mysql';
    connectionString?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
}

// Project Type Detection
export type ProjectType = 'frontend-only' | 'backend-only' | 'fullstack' | 'react' | 'react-fullstack';

export interface ProjectMetadata {
    type: ProjectType;
    hasDatabase: boolean;
    databaseType?: 'mongodb' | 'postgresql' | 'mysql';
    hasReact: boolean;
    hasBackend: boolean;
}
