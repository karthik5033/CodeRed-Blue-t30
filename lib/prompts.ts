/**
 * Enhanced prompts for full-stack application generation with multi-page support
 */

export const MULTIPAGE_AUTH_TEMPLATE = `
// ===== PAGE ROUTING SYSTEM =====
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        // Check if the page uses flex layout (auth pages)
        if (targetPage.classList.contains('flex')) {
            targetPage.style.display = 'flex';
        } else {
            targetPage.style.display = 'block';
        }
    }
    
    window.location.hash = pageName;
}

function checkAuth() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function requireAuth(pageName) {
    const user = checkAuth();
    if (!user) {
        showPage('login');
        return false;
    }
    showPage(pageName);
    return true;
}

// ===== AUTHENTICATION FUNCTIONS =====
async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name')?.value.trim() || email.split('@')[0];
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const checkResponse = await fetch(\`/api/database?action=data&table=users\`);
        const checkResult = await checkResponse.json();
        
        if (checkResult.success && checkResult.data) {
            const existingUser = checkResult.data.find(u => {
                const userData = JSON.parse(u.data);
                return userData.email === email;
            });
            
            if (existingUser) {
                alert('Email already registered. Please login.');
                showPage('login');
                return;
            }
        }
        
        const userData = {
            email,
            password: btoa(password),
            name,
            created_at: new Date().toISOString()
        };
        
        const response = await fetch('/api/database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'insert',
                table: 'users',
                data: { data: JSON.stringify(userData) }
            })
        });
        
        const result = await response.json();
        if (result.success) {
            localStorage.setItem('user', JSON.stringify({ id: result.id, ...userData }));
            alert('Account created successfully!');
            showPage('dashboard');
            displayUserInfo({ id: result.id, ...userData });
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    try {
        const response = await fetch(\`/api/database?action=data&table=users\`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const user = result.data.find(u => {
                const userData = JSON.parse(u.data);
                return userData.email === email && userData.password === btoa(password);
            });
            
            if (user) {
                const userData = JSON.parse(user.data);
                localStorage.setItem('user', JSON.stringify({ id: user.id, ...userData }));
                alert('Login successful!');
                showPage('dashboard');
                displayUserInfo({ id: user.id, ...userData });
            } else {
                alert('Invalid email or password');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    alert('Logged out successfully');
    showPage('landing');
}

function displayUserInfo(user) {
    const nameElement = document.getElementById('user-name');
    const emailElement = document.getElementById('user-email');
    
    if (nameElement) nameElement.textContent = user.name || user.email;
    if (emailElement) emailElement.textContent = user.email;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Create users table
    await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'create_table',
            table: 'users',
            columns: [
                { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
                { name: 'data', type: 'TEXT' },
                { name: 'created_at', type: 'TEXT' }
            ]
        })
    });
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        if (hash === 'dashboard') {
            requireAuth('dashboard');
        } else {
            showPage(hash);
        }
    } else {
        showPage('landing');
    }
    
    const user = checkAuth();
    if (user) {
        displayUserInfo(user);
    }
});
`;

function detectPages(prompt: string): { pages: string[]; hasMultiplePages: boolean } {
    const lowerPrompt = prompt.toLowerCase();
    const pageKeywords = {
        landing: ['landing', 'home', 'homepage'],
        login: ['login', 'sign in'],
        signup: ['signup', 'register', 'sign up'],
        dashboard: ['dashboard'],
        profile: ['profile'],
        contact: ['contact'],
        about: ['about'],
    };

    const detectedPages: string[] = [];
    for (const [pageName, keywords] of Object.entries(pageKeywords)) {
        if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
            detectedPages.push(pageName);
        }
    }

    if (detectedPages.length === 0) {
        detectedPages.push('index');
    }

    return {
        pages: detectedPages,
        hasMultiplePages: detectedPages.length > 1,
    };
}

export const SYSTEM_PROMPT = `You are an expert full-stack web developer. Generate production-ready code with working functionality.

## CRITICAL RULES:

1. **Frontend**: HTML/CSS/JS only (NO React)
2. **Backend**: Express.js with actual working routes
3. **Database**: Local SQLite (no connection string needed)
4. **API Calls**: Frontend MUST call backend APIs
5. **Images**: YOU MUST use the Unsplash API proxy for ALL images. 

   **CRITICAL IMAGE RULES:**
   - Endpoint format: \`/api/unsplash-image?query={search_term}\`
   - Image URLs must ALWAYS be hardcoded strings, NEVER variables
   - Example: \`<img src="/api/unsplash-image?query=laptop" alt="Laptop" />\`
   - For product images: \`/api/unsplash-image?query=laptop&width=400&height=400\`
   - For hero images: \`/api/unsplash-image?query=technology&width=1200&height=600\`
   - Do NOT use: \`<img src="\${imageUrl}" ...>\` or any JavaScript variables
   - Do NOT construct URLs dynamically in JavaScript
   - Do NOT use placeholders like "undefined" or empty strings

## MULTI-PAGE APPS - SINGLE HTML FILE:

For apps with multiple pages (landing, login, signup, dashboard), generate ONE HTML file with multiple page sections:

### ⚠️ AUTH PAGE STRUCTURE - CRITICAL:

**ALL login and signup pages MUST be centered using this EXACT structure:**

\`\`\`html
<div id="login-page" class="page min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500" style="display:none">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
    <!-- Form content here -->
  </div>
</div>
\`\`\`

**Required classes for auth pages:**
- Parent div: \`min-h-screen flex items-center justify-center\` + gradient background
- Form container: \`max-w-md w-full bg-white rounded-2xl shadow-2xl p-8\`

**DO NOT:**
- ❌ Put form on one side with gradient on the other
- ❌ Use grid layouts for auth pages
- ❌ Skip the centering flexbox classes
- ❌ Make the white container full-width

### Multi-Page Example:

\`\`\`html
<body>
  <!-- Navigation/Routing Logic -->
  <script>
    function showPage(pageId) {
      document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
      const targetPage = document.getElementById(pageId + '-page');
      if (targetPage) {
        // Check if the page uses flex layout (auth pages)
        if (targetPage.classList.contains('flex')) {
          targetPage.style.display = 'flex';
        } else {
          targetPage.style.display = 'block';
        }
      }
      // If navigating to dashboard, check auth
      if (pageId === 'dashboard' && !localStorage.getItem('user')) {
        showPage('login');
      }
    }
    // Check auth on load
    window.onload = function() {
       const user = localStorage.getItem('user');
       if (user) showPage('dashboard');
       else showPage('landing');
    }
  </script>

  <!-- Landing Page -->
  <div id="landing-page" class="page">
    <nav>...</nav>
    <header class="hero">
        <!-- USE REAL IMAGES -->
        <img src="/api/unsplash-image?query=technology" class="hero-bg" />
        <h1>Welcome</h1>
    </header>
    <button onclick="showPage('login')">Login</button>
  </div>

  <!-- Login Page -->
  <div id="login-page" class="page min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500" style="display:none">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-2xl font-bold mb-6">Login</h2>
        <!-- Forms must be visible and styled -->
        <form onsubmit="handleLogin(event)">
            <input id="login-email" type="email" placeholder="Email" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" required />
            <input id="login-password" type="password" placeholder="Password" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" required />
            <button type="submit" class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Login</button>
        </form>
        <p class="mt-4 text-center text-sm">Don't have an account? <a href="#" onclick="showPage('signup')" class="text-purple-600 font-semibold">Sign up</a></p>
    </div>
  </div>

  <!-- Signup Page -->
  <div id="signup-page" class="page min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500" style="display:none">
     <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-2xl font-bold mb-6">Create Account</h2>
        <form onsubmit="handleSignup(event)">
            <input id="signup-name" type="text" placeholder="Full Name" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" required />
            <input id="signup-email" type="email" placeholder="Email" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" required />
            <input id="signup-password" type="password" placeholder="Create Password" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" required />
            <button type="submit" class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-sm">Already have an account? <a href="#" onclick="showPage('login')" class="text-purple-600 font-semibold">Login</a></p>
    </div>
  </div>
</body>
\`\`\`

## FRONTEND JAVASCRIPT - MAKE IT WORK:

**CRITICAL**: All buttons and forms MUST have working JavaScript that calls APIs:

\`\`\`javascript:frontend/js/script.js
const API_URL = '/api/database';
const TABLE_NAME = 'todos';

// Initialize - create table on load
async function initDatabase() {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_table',
                table: TABLE_NAME,
                columns: [
                    { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
                    { name: 'data', type: 'TEXT' },
                    { name: 'created_at', type: 'TEXT' }
                ]
            })
        });
        loadTodos();
    } catch (error) {
        console.error('Init error:', error);
    }
}

// Add todo
async function addTodo() {
    const input = document.getElementById('todo-input');
    const todo = input.value.trim();
    
    if (!todo) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'insert',
                table: TABLE_NAME,
                data: { data: JSON.stringify({ text: todo, completed: false }) }
            })
        });
        
        const result = await response.json();
        if (result.success) {
            input.value = '';
            loadTodos();
        } else {
            console.error('Error adding todo:', result.error);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

// Load todos
async function loadTodos() {
    try {
        const response = await fetch(\`\${API_URL}?action=data&table=\${TABLE_NAME}\`);
        const result = await response.json();
        
        if (result.success) {
            displayTodos(result.data || []);
        } else {
            console.error('Error loading todos:', result.error);
        }
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

// Display todos
function displayTodos(todos) {
    const list = document.getElementById('todo-list');
    if (!list) return;
    
    if (todos.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-4">No todos yet. Add one above!</p>';
        return;
    }
    
    list.innerHTML = todos.map(todo => {
        const data = JSON.parse(todo.data);
        return \`
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="flex-1">\${data.text}</span>
                <button onclick="deleteTodo(\${todo.id})" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                    Delete
                </button>
            </div>
        \`;
    }).join('');
}

// Delete todo
async function deleteTodo(id) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                table: TABLE_NAME,
                id: id
            })
        });
        const result = await response.json();
        if (result.success) {
            loadTodos();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
});
\`\`\`

## DATABASE SCHEMA:

For each model, the system will auto-create SQLite tables. You just need to specify the table name in your API calls.

Example for Todo app:
- Table: \`todos\`
- Columns: id (auto), data (JSON), created_at (auto)

## STYLING:

Use Tailwind CSS with beautiful gradients and modern design:

\`\`\`html
<div class="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-6">
  <div class="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Todo App</h1>
    <div class="flex gap-2 mb-6">
      <input id="todo-input" class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all" placeholder="Add new todo..." />
      <button onclick="addTodo()" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">Add</button>
    </div>
    <div id="todo-list" class="space-y-2"></div>
  </div>
</div>
\`\`\`

**For images, use img tags with /api/pexels-image:**
\`\`\`html
<img src="/api/pexels-image?query=technology&width=800&height=400" alt="Hero image" class="w-full rounded-lg" />
\`\`\`

**DO NOT fetch images with JavaScript** - use img src directly!

## OUTPUT FORMAT:

\`\`\`html:frontend/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Beautiful UI here -->
  <script src="js/script.js"></script>
</body>
</html>
\`\`\`

\`\`\`css:frontend/css/style.css
/* Custom styles */
.page {
    min-height: 100vh;
    width: 100%;
    transition: opacity 0.3s ease;
}
\`\`\`

\`\`\`javascript:frontend/js/script.js
// Working JavaScript with API calls
\`\`\`

CRITICAL: Every button MUST have onclick handlers that call APIs!`;

export function generatePagePrompt(userRequest: string) {
    const pageDetection = detectPages(userRequest);
    const lowerRequest = userRequest.toLowerCase();

    const needsDatabase = lowerRequest.includes('database') ||
        lowerRequest.includes('save') ||
        lowerRequest.includes('store') ||
        lowerRequest.includes('todo') ||
        lowerRequest.includes('blog') ||
        lowerRequest.includes('app') ||
        lowerRequest.includes('login') ||
        lowerRequest.includes('signup');

    const needsAuth = pageDetection.pages.includes('login') ||
        pageDetection.pages.includes('signup') ||
        pageDetection.pages.includes('dashboard');

    let instructions = `${SYSTEM_PROMPT}

USER REQUEST: ${userRequest}

${pageDetection.hasMultiplePages ? `
=== MULTI-PAGE APP DETECTED ===

PAGES TO GENERATE: ${pageDetection.pages.join(', ')}

CRITICAL: Generate a SINGLE HTML file with ALL pages as separate divs:

\`\`\`html:frontend/index.html
<!DOCTYPE html>
<html>
<head>
    <title>Shoe Company</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <!-- Page 1: Landing -->
    <div id="landing-page" class="page">
        <h1>Welcome to ShoeCo</h1>
        <button onclick="showPage('login')">Login</button>
        <button onclick="showPage('signup')">Sign Up</button>
    </div>

    <!-- Page 2: Login -->
    <div id="login-page" class="page min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500" style="display:none">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold mb-6">Login</h2>
            <input id="login-email" type="email" placeholder="Email" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" />
            <input id="login-password" type="password" placeholder="Password" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" />
            <button onclick="handleLogin()" class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Login</button>
            <p class="mt-4 text-center text-sm"><a href="#" onclick="showPage('signup')" class="text-purple-600 font-semibold">Sign Up</a></p>
        </div>
    </div>

    <!-- Page 3: Signup -->
    <div id="signup-page" class="page min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500" style="display:none">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
            <input id="signup-name" type="text" placeholder="Name" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" />
            <input id="signup-email" type="email" placeholder="Email" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" />
            <input id="signup-password" type="password" placeholder="Password" class="w-full px-4 py-3 mb-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none" />
            <button onclick="handleSignup()" class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Sign Up</button>
            <p class="mt-4 text-center text-sm"><a href="#" onclick="showPage('login')" class="text-purple-600 font-semibold">Login</a></p>
        </div>
    </div>

    <!-- Page 4: Dashboard -->
    <div id="dashboard-page" class="page" style="display:none">
        <h2>Dashboard</h2>
        <p>Welcome, <span id="user-name"></span>!</p>
        <p>Email: <span id="user-email"></span></p>
        <button onclick="handleLogout()">Logout</button>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
\`\`\`

\`\`\`javascript:frontend/js/script.js
${MULTIPAGE_AUTH_TEMPLATE}

// Add any additional app-specific functions here
\`\`\`

\`\`\`css:frontend/css/style.css
.page {
    min-height: 100vh;
    width: 100%;
    padding: 2rem;
}
\`\`\`

IMPORTANT RULES:
1. Generate EXACTLY 3 files: index.html, js/script.js, css/style.css
2. Include the COMPLETE authentication code in script.js
3. Each page must be a div with class="page" and id="[name]-page"
4. First page visible, others have style="display:none"
5. Use showPage() to navigate, handleLogin/Signup for auth
` : `
Generate a single-page application with beautiful UI.
`}

${needsAuth ? `
=== AUTHENTICATION REQUIRED ===

Your JavaScript file MUST include:
1. showPage() function for navigation
2. handleSignup() function that creates users in database
3. handleLogin() function that verifies credentials
4. handleLogout() function that clears session
5. checkAuth() and requireAuth() for protection
6. displayUserInfo() to show user data

The complete code is provided above in the template. COPY IT EXACTLY into your script.js file.
` : ''}

${needsDatabase ? `
=== BACKEND FILES REQUIRED ===

Generate backend files for a standalone, downloadable application:

\`\`\`javascript:backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database file path
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tables: {} }));
}

// Database API endpoint
app.post('/api/database', (req, res) => {
    const { action, table, data, id, columns } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    switch (action) {
        case 'create_table':
            if (!db.tables[table]) {
                db.tables[table] = { columns, rows: [] };
            }
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
            res.json({ success: true });
            break;

        case 'insert':
            if (!db.tables[table]) {
                return res.json({ success: false, error: 'Table not found' });
            }
            const newId = db.tables[table].rows.length + 1;
            db.tables[table].rows.push({ id: newId, ...data, created_at: new Date().toISOString() });
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
            res.json({ success: true, id: newId });
            break;

        case 'data':
            if (!db.tables[table]) {
                return res.json({ success: false, error: 'Table not found' });
            }
            res.json({ success: true, data: db.tables[table].rows });
            break;

        case 'delete':
            if (!db.tables[table]) {
                return res.json({ success: false, error: 'Table not found' });
            }
            db.tables[table].rows = db.tables[table].rows.filter(row => row.id !== id);
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
            res.json({ success: true });
            break;

        default:
            res.json({ success: false, error: 'Invalid action' });
    }
});

app.get('/api/database', (req, res) => {
    const { action, table } = req.query;
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    if (action === 'data' && table) {
        if (!db.tables[table]) {
            return res.json({ success: false, error: 'Table not found' });
        }
        res.json({ success: true, data: db.tables[table].rows });
    } else if (action === 'tables') {
        const tables = Object.keys(db.tables).map(name => ({ name }));
        res.json({ success: true, data: tables });
    } else {
        res.json({ success: false, error: 'Invalid action' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`

\`\`\`json:backend/package.json
{
  "name": "generated-app-backend",
  "version": "1.0.0",
  "description": "Backend for generated application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
\`\`\`

\`\`\`markdown:README.md
# Generated Application

## Setup

1. Install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

2. Start the server:
\`\`\`bash
npm start
\`\`\`

3. Open browser:
\`\`\`
http://localhost:3000
\`\`\`

## Features

- Multi-page navigation (landing, login, signup, dashboard)
- User authentication with database storage
- Local JSON database (no external DB needed)
- Responsive design with Tailwind CSS

## File Structure

\`\`\`
/frontend
  /css
    style.css
  /js
    script.js
  index.html
/backend
  server.js
  package.json
  database.json (created automatically)
README.md
\`\`\`
\`\`\`
` : ''}

CRITICAL REQUIREMENTS:
1. Use Tailwind CSS for styling
2. ${needsDatabase ? 'Include working database API calls AND backend files' : 'Add interactive features'}
3. ${needsAuth ? 'MUST include complete authentication code from template' : ''}
4. ${pageDetection.hasMultiplePages ? 'ALL pages in ONE HTML file' : ''}
5. Make it beautiful with gradients and modern design
6. ${needsDatabase ? 'Generate backend/server.js and backend/package.json for standalone deployment' : ''}

Return complete, working code with proper file paths.`;

    return instructions;
}

export function generateModificationPrompt(existingCode: string, modification: string) {
    return `${SYSTEM_PROMPT}

EXISTING CODE:
\`\`\`
${existingCode}
\`\`\`

MODIFICATION: ${modification}

Update the code while maintaining all working functionality.`;
}

export function generateCustomizationPrompt(existingCode: string, customizations: any) {
    return generateModificationPrompt(existingCode, JSON.stringify(customizations));
}