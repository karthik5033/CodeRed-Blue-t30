/**
 * Visual Builder API Client
 * Client-side functions to interact with the visual-builder backend
 */

import { Project, Page } from '../visual-builder-types';

const API_BASE = '/api/visual-builder';

export const visualBuilderAPI = {
    // Projects
    async getProjects(): Promise<{ success: boolean; data?: any[]; error?: string }> {
        const response = await fetch(API_BASE);
        return response.json();
    },

    async getProject(id: string): Promise<{ success: boolean; data?: Project; error?: string }> {
        const response = await fetch(`${API_BASE}?id=${id}`);
        return response.json();
    },

    async createProject(name: string): Promise<{ success: boolean; data?: any; error?: string }> {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_project',
                project: { name },
            }),
        });
        return response.json();
    },

    async updateProject(projectId: string, updates: { name?: string; currentPageId?: string }): Promise<{ success: boolean; error?: string }> {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_project',
                projectId,
                project: updates,
            }),
        });
        return response.json();
    },

    async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
        const response = await fetch(`${API_BASE}?id=${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Pages
    async createPage(projectId: string, name: string, elements: any[] = []): Promise<{ success: boolean; data?: any; error?: string }> {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_page',
                projectId,
                page: { name, elements },
            }),
        });
        return response.json();
    },

    async updatePage(pageId: string, updates: { name?: string; elements?: any[] }): Promise<{ success: boolean; error?: string }> {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_page',
                pageId,
                page: updates,
            }),
        });
        return response.json();
    },

    async deletePage(pageId: string): Promise<{ success: boolean; error?: string }> {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete_page',
                pageId,
            }),
        });
        return response.json();
    },

    // Auto-save helper
    async autoSaveProject(project: Project): Promise<{ success: boolean; error?: string }> {
        // Update project metadata
        await this.updateProject(project.id, {
            name: project.name,
            currentPageId: project.currentPageId,
        });

        // Update all pages
        for (const page of project.pages) {
            await this.updatePage(page.id, {
                name: page.name,
                elements: page.elements,
            });
        }

        return { success: true };
    },
};
