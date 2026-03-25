// Get the API base URL from environment variable
// For development: http://localhost:5000
// For production: your-vercel-domain.vercel.app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
