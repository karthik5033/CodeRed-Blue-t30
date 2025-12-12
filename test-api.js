
const fetch = require('node-fetch'); // Might need to install or use native fetch if node 18+

async function testInsert() {
    try {
        const payload = {
            action: 'insert',
            table: 'app_form_submissions',
            data: {
                project_id: 'test_project',
                form_id: 'test_form_' + Date.now(),
                data: JSON.stringify({ name: 'Test User', email: 'test@example.com' })
            }
        };

        console.log('Sending payload:', JSON.stringify(payload, null, 2));

        const response = await fetch('http://localhost:3000/api/database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Body:', text);

    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testInsert();
