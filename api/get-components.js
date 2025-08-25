// Import tools needed to find and read files
import path from 'path';
import { promises as fs } from 'fs';

// --- SECURITY CONFIGURATION ---
// This is the list of websites allowed to request our data.
const ALLOWED_REFERERS = [
    'https://loamlabsusa.com',
    'e6f6c8-2.myshopify.com',
    'https://loamlabs.myshopify.com' 
    // Add your development store URL here if you have one
];

// This is the main function that runs when someone accesses the URL
export default async function handler(request, response) {
    
    // --- THE SECURITY CHECK ---
    const referer = request.headers.referer;

    // Check if the request is coming from an allowed website.
    const isAllowed = referer && ALLOWED_REFERERS.some(allowedDomain => referer.startsWith(allowedDomain));

    // If the referer is missing or not in our allowed list, deny access.
    if (!isAllowed) {
        // Send a "403 Forbidden" status and an error message.
        return response.status(403).json({ error: 'Access Denied: You do not have permission to access this resource.' });
    }

    // --- If the security check passes, proceed to send the data ---
    try {
        // Figure out the full path to our database file
        const jsonFilePath = path.resolve(process.cwd(), 'll-component-database.json');
        
        // Read the file from the server's disk
        const fileContents = await fs.readFile(jsonFilePath, 'utf8');
        
        // Convert the file content into a usable JSON object
        const data = JSON.parse(fileContents);
        
        // Send the data back to the browser with a "200 OK" status
        return response.status(200).json(data);

    } catch (error) {
        // If anything goes wrong (e.g., file not found), log it for debugging...
        console.error(error);
        // ...and send a "500 Server Error" message.
        return response.status(500).json({ error: 'Could not load component data.' });
    }
}
