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
    
    // --- CORS PERMISSION LOGIC ---
    const origin = request.headers.origin;
    if (origin && ALLOWED_REFERERS.some(allowedDomain => origin.startsWith(allowedDomain))) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // --- REFERER SECURITY CHECK ---
    const referer = request.headers.referer;
    const isAllowed = referer && ALLOWED_REFERERS.some(allowedDomain => referer.startsWith(allowedDomain));

    if (!isAllowed) {
        return response.status(403).json({ error: 'Access Denied: You do not have permission to access this resource.' });
    }

    // --- If security checks pass, load, combine, and send the data ---
    try {
        // Define paths to the new individual component files
        const dataPath = path.resolve(process.cwd(), 'component-data');
        const rimsPath = path.join(dataPath, 'rims.json');
        const hubsPath = path.join(dataPath, 'hubs.json');
        const spokesPath = path.join(dataPath, 'spokes.json');
        const nipplesPath = path.join(dataPath, 'nipples.json');

        // Read all component files in parallel
        const [rimsContents, hubsContents, spokesContents, nipplesContents] = await Promise.all([
            fs.readFile(rimsPath, 'utf8'),
            fs.readFile(hubsPath, 'utf8'),
            fs.readFile(spokesPath, 'utf8'),
            fs.readFile(nipplesPath, 'utf8')
        ]);

        // Combine the contents into a single object
        const combinedData = {
            rims: JSON.parse(rimsContents),
            hubs: JSON.parse(hubsContents),
            spokes: JSON.parse(spokesContents),
            nipples: JSON.parse(nipplesContents)
        };
        
        return response.status(200).json(combinedData);

    } catch (error) {
        console.error('Error reading or parsing component files:', error);
        return response.status(500).json({ error: 'Could not load component data.' });
    }
}
