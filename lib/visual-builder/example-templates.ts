/**
 * Multi-Page Example Templates with Section Support
 * Landing pages have sections, auth pages are separate
 */

import { Page, PageSection } from '../visual-builder-types';

export interface MultiPageTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    pages: Page[];
}

export const MULTI_PAGE_TEMPLATES: MultiPageTemplate[] = [
    {
        id: 'saas-landing',
        name: 'SaaS Landing Package',
        description: 'Landing page with sections + auth pages',
        category: 'Marketing',
        thumbnail: '🚀',
        pages: [
            // Landing page with sections
            {
                id: 'landing',
                name: 'Landing Page',
                type: 'landing',
                elements: [], // Not used for landing pages
                sections: [
                    {
                        id: 'home',
                        name: 'Home',
                        elements: [
                            {
                                id: 'nav-1',
                                type: 'navbar',
                                category: 'navigation',
                                position: { x: 0, y: 0 },
                                size: { width: '100%', height: 'auto' },
                                properties: {
                                    items: [
                                        { label: 'Home', href: '#home' },
                                        { label: 'Features', href: '#features' },
                                        { label: 'Pricing', href: '#pricing' },
                                        { label: 'Contact', href: '#contact' },
                                        { label: 'Login', href: '/login' },
                                    ],
                                },
                                styles: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '20px 48px',
                                    backgroundColor: '#ffffff',
                                    borderBottom: '1px solid #e5e7eb',
                                },
                            },
                            {
                                id: 'hero-1',
                                type: 'heading',
                                category: 'basic',
                                position: { x: 300, y: 150 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { text: 'Build Your SaaS Faster', level: '1' },
                                styles: { fontSize: '56px', fontWeight: '700', color: '#111827', textAlign: 'center' },
                            },
                            {
                                id: 'hero-subtitle',
                                type: 'paragraph',
                                category: 'basic',
                                position: { x: 250, y: 240 },
                                size: { width: '520px', height: 'auto' },
                                properties: { text: 'Everything you need to launch and scale your SaaS product' },
                                styles: { fontSize: '20px', color: '#6b7280', textAlign: 'center' },
                            },
                            {
                                id: 'cta-button',
                                type: 'button',
                                category: 'basic',
                                position: { x: 420, y: 320 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { label: 'Get Started Free' },
                                styles: {
                                    padding: '16px 32px',
                                    backgroundColor: '#8b5cf6',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                },
                            },
                        ],
                    },
                    {
                        id: 'features',
                        name: 'Features',
                        elements: [
                            {
                                id: 'features-title',
                                type: 'heading',
                                category: 'basic',
                                position: { x: 380, y: 40 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { text: 'Features', level: '1' },
                                styles: { fontSize: '40px', fontWeight: '700', color: '#111827' },
                            },
                            {
                                id: 'feature-1',
                                type: 'card',
                                category: 'content',
                                position: { x: 50, y: 140 },
                                size: { width: '280px', height: 'auto' },
                                properties: { title: 'Fast Performance', text: 'Optimized for speed' },
                                styles: { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' },
                            },
                            {
                                id: 'feature-2',
                                type: 'card',
                                category: 'content',
                                position: { x: 370, y: 140 },
                                size: { width: '280px', height: 'auto' },
                                properties: { title: 'Secure', text: 'Enterprise-grade security' },
                                styles: { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' },
                            },
                            {
                                id: 'feature-3',
                                type: 'card',
                                category: 'content',
                                position: { x: 690, y: 140 },
                                size: { width: '280px', height: 'auto' },
                                properties: { title: 'Easy Integration', text: 'Connect with tools' },
                                styles: { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' },
                            },
                        ],
                    },
                    {
                        id: 'pricing',
                        name: 'Pricing',
                        elements: [
                            {
                                id: 'pricing-title',
                                type: 'heading',
                                category: 'basic',
                                position: { x: 380, y: 40 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { text: 'Simple Pricing', level: '1' },
                                styles: { fontSize: '40px', fontWeight: '700', color: '#111827' },
                            },
                            {
                                id: 'price-1',
                                type: 'card',
                                category: 'content',
                                position: { x: 150, y: 140 },
                                size: { width: '300px', height: 'auto' },
                                properties: { title: 'Starter - $29/mo', text: 'For small teams' },
                                styles: { padding: '32px', backgroundColor: '#ffffff', border: '2px solid #8b5cf6', borderRadius: '12px' },
                            },
                            {
                                id: 'price-2',
                                type: 'card',
                                category: 'content',
                                position: { x: 570, y: 140 },
                                size: { width: '300px', height: 'auto' },
                                properties: { title: 'Pro - $99/mo', text: 'For growing businesses' },
                                styles: { padding: '32px', backgroundColor: '#ffffff', border: '2px solid #8b5cf6', borderRadius: '12px' },
                            },
                        ],
                    },
                    {
                        id: 'contact',
                        name: 'Contact',
                        elements: [
                            {
                                id: 'contact-title',
                                type: 'heading',
                                category: 'basic',
                                position: { x: 380, y: 40 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { text: 'Get in Touch', level: '1' },
                                styles: { fontSize: '36px', fontWeight: '700', color: '#111827' },
                            },
                            {
                                id: 'name-input',
                                type: 'input',
                                category: 'forms',
                                position: { x: 312, y: 140 },
                                size: { width: '400px', height: '42px' },
                                properties: { placeholder: 'Your Name', name: 'name' },
                                styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                            },
                            {
                                id: 'email-input',
                                type: 'input',
                                category: 'forms',
                                position: { x: 312, y: 200 },
                                size: { width: '400px', height: '42px' },
                                properties: { placeholder: 'Your Email', name: 'email' },
                                styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                            },
                            {
                                id: 'submit-btn',
                                type: 'button',
                                category: 'basic',
                                position: { x: 450, y: 270 },
                                size: { width: 'auto', height: 'auto' },
                                properties: { label: 'Send Message' },
                                styles: { padding: '12px 32px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '6px' },
                            },
                        ],
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Separate auth pages
            {
                id: 'login',
                name: 'Login',
                type: 'page',
                elements: [
                    {
                        id: 'login-title',
                        type: 'heading',
                        category: 'basic',
                        position: { x: 400, y: 100 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { text: 'Welcome Back', level: '1' },
                        styles: { fontSize: '32px', fontWeight: '700', color: '#111827', textAlign: 'center' },
                    },
                    {
                        id: 'email',
                        type: 'input',
                        category: 'forms',
                        position: { x: 312, y: 200 },
                        size: { width: '400px', height: '42px' },
                        properties: { placeholder: 'Email', name: 'email' },
                        styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                    },
                    {
                        id: 'password',
                        type: 'input',
                        category: 'forms',
                        position: { x: 312, y: 260 },
                        size: { width: '400px', height: '42px' },
                        properties: { placeholder: 'Password', name: 'password' },
                        styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                    },
                    {
                        id: 'login-btn',
                        type: 'button',
                        category: 'basic',
                        position: { x: 450, y: 330 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { label: 'Sign In' },
                        styles: { padding: '12px 48px', backgroundColor: '#8b5cf6', color: '#ffffff', borderRadius: '6px', fontWeight: '600' },
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'signup',
                name: 'Signup',
                type: 'page',
                elements: [
                    {
                        id: 'signup-title',
                        type: 'heading',
                        category: 'basic',
                        position: { x: 380, y: 80 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { text: 'Create Account', level: '1' },
                        styles: { fontSize: '32px', fontWeight: '700', color: '#111827' },
                    },
                    {
                        id: 'name',
                        type: 'input',
                        category: 'forms',
                        position: { x: 312, y: 160 },
                        size: { width: '400px', height: '42px' },
                        properties: { placeholder: 'Full Name', name: 'name' },
                        styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                    },
                    {
                        id: 'email',
                        type: 'input',
                        category: 'forms',
                        position: { x: 312, y: 220 },
                        size: { width: '400px', height: '42px' },
                        properties: { placeholder: 'Email', name: 'email' },
                        styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                    },
                    {
                        id: 'password',
                        type: 'input',
                        category: 'forms',
                        position: { x: 312, y: 280 },
                        size: { width: '400px', height: '42px' },
                        properties: { placeholder: 'Password', name: 'password' },
                        styles: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' },
                    },
                    {
                        id: 'signup-btn',
                        type: 'button',
                        category: 'basic',
                        position: { x: 440, y: 350 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { label: 'Create Account' },
                        styles: { padding: '12px 32px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '6px', fontWeight: '600' },
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    },
    {
        id: 'dashboard-app',
        name: 'Dashboard Application',
        description: 'Complete dashboard with analytics and settings pages',
        category: 'Business',
        thumbnail: '📊',
        pages: [
            {
                id: 'dashboard',
                name: 'Dashboard',
                type: 'page',
                elements: [
                    {
                        id: 'dash-title',
                        type: 'heading',
                        category: 'basic',
                        position: { x: 50, y: 40 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { text: 'Dashboard', level: '1' },
                        styles: { fontSize: '32px', fontWeight: '700', color: '#111827' },
                    },
                    {
                        id: 'stat-1',
                        type: 'card',
                        category: 'content',
                        position: { x: 50, y: 120 },
                        size: { width: '220px', height: 'auto' },
                        properties: { title: 'Total Users', text: '12,450' },
                        styles: { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' },
                    },
                    {
                        id: 'stat-2',
                        type: 'card',
                        category: 'content',
                        position: { x: 290, y: 120 },
                        size: { width: '220px', height: 'auto' },
                        properties: { title: 'Revenue', text: '$82,340' },
                        styles: { padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' },
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'settings',
                name: 'Settings',
                type: 'page',
                elements: [
                    {
                        id: 'settings-title',
                        type: 'heading',
                        category: 'basic',
                        position: { x: 50, y: 40 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { text: 'Settings', level: '1' },
                        styles: { fontSize: '32px', fontWeight: '700', color: '#111827' },
                    },
                    {
                        id: 'notif-checkbox',
                        type: 'checkbox',
                        category: 'forms',
                        position: { x: 50, y: 140 },
                        size: { width: 'auto', height: 'auto' },
                        properties: { label: 'Email Notifications', name: 'notifications' },
                        styles: { display: 'flex', alignItems: 'center', gap: '8px' },
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    },
];

export function getMultiPageTemplate(id: string): MultiPageTemplate | undefined {
    return MULTI_PAGE_TEMPLATES.find(t => t.id === id);
}
