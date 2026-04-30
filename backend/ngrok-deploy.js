const ngrok = require('ngrok');

async function startNgrok() {
    try {
        console.log('Starting ngrok tunnels...');
        
        // Start backend tunnel
        const backendUrl = await ngrok.connect({
            proto: 'http',
            addr: 5000,
            authtoken: process.env.NGROK_AUTH_TOKEN || undefined
        });
        
        console.log('\n✓ Backend Tunnel:');
        console.log(`  ${backendUrl}`);
        console.log('  Local: http://localhost:5000\n');
        
        // Start frontend tunnel
        const frontendUrl = await ngrok.connect({
            proto: 'http',
            addr: 5173,
            authtoken: process.env.NGROK_AUTH_TOKEN || undefined
        });
        
        console.log('✓ Frontend Tunnel:');
        console.log(`  ${frontendUrl}`);
        console.log('  Local: http://localhost:5173\n');
        
        console.log('=== DEPLOYMENT URLS ===');
        console.log(`Backend API: ${backendUrl}`);
        console.log(`Dashboard UI: ${frontendUrl}`);
        console.log('\nPress Ctrl+C to stop tunnels\n');
        
        // Log tunnel info
        console.log('Tunnel Status: Running');
        console.log('Connected at:', new Date().toLocaleString());
        
    } catch (error) {
        console.error('Error starting ngrok:', error);
        process.exit(1);
    }
}

startNgrok();
