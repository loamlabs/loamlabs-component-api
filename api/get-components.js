// Import tools needed to find and read files
import path from 'path';
import { promises as fs } from 'fs';

// --- SECURITY CONFIGURATION ---
const ALLOWED_REFERERS = [
    'https://loamlabsusa.com',
    'https://loamlabs.myshopify.com',
    'https://e6f6c8-2.myshopify.com' // Your dev store
];

// This is the main function that runs when someone accesses the URL
export default async function handler(request, response) {
    
    // --- NEW: CORS PERMISSION LOGIC ---
    const origin = request.headers.origin;
    if (origin && ALLOWED_REFERERS.some(allowedDomain => origin.startsWith(allowedDomain))) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    // The browser sometimes sends a "preflight" OPTIONS request first to check permissions.
    // If it's an OPTIONS request, we just send back the headers and a "200 OK".
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // --- THE REFERER SECURITY CHECK (Stays the same) ---
    const referer = request.headers.referer;
    const isAllowed = referer && ALLOWED_REFERERS.some(allowedDomain => referer.startsWith(allowedDomain));

    if (!isAllowed) {
        return response.status(403).json({ error: 'Access Denied: You do not have permission to access this resource.' });
    }

    // --- If security checks pass, send the data (Stays the same) ---
    try {
        const jsonFilePath = path.resolve(process.cwd(), 'll-component-database.json');
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Could not load component data.' });
    }
}
