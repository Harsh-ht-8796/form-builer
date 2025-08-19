import NextAuth from 'next-auth';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '@/lib/routes';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

// API base URL (use environment variable in production)
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Optional: Server-side Bearer token (if not using user token)
const API_TOKEN = process.env.FORM_API_TOKEN; // Set in .env

export default auth(async (req) => {
    const { nextUrl } = req;
    const isAuthenticated = !!req.auth;
    const pathname = nextUrl.pathname;
    console.log({ pathname });

    // Check if the route is a form route (e.g., /form/:id)
    const isFormRoute = pathname.match(/^\/form\/[a-zA-Z0-9]+$/);

    if (isFormRoute) {
        const formId = pathname.split('/')[2]; // Extract form ID from /form/:id
        try {
            // Use the user's token from NextAuth session, or fallback to server-side token
            const token = req.auth?.user.accessToken || API_TOKEN;

            // Call the endpoint to check form visibility
            const response = await fetch(`${API_BASE_URL}/forms/${formId}/user-view`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.error(`Unauthorized access to form ${formId}: 401`);
                    // Redirect to /auth/login with formId as query parameter
                    const loginUrl = new URL('/auth/login', nextUrl);
                    loginUrl.searchParams.set('formId', formId);
                    return Response.redirect(loginUrl);
                }
                throw new Error(`Failed to fetch form status: ${response.status}`);
            }

            const { settings } = await response.json();
            const isPublic = settings?.visibility?.includes('public');

            // If the form is public, allow access without checking token
            if (isPublic) {
                return; // Proceed to the form page
            }

            // If the form is private or domain_restricted, check token and authentication
            if (!token) {
                console.error('No token available for private form access');
                return Response.redirect(new URL(ROOT, nextUrl));
            }

            if (!isAuthenticated) {
                return Response.redirect(new URL(ROOT, nextUrl));
            }

            // If token is available and user is authenticated, allow access
            return;
        } catch (error) {
            console.error('Error checking form status:', error);
            // Fallback: treat as private form if endpoint fails
            if (!isAuthenticated) {
                return Response.redirect(new URL(ROOT, nextUrl));
            }
            return; // Allow authenticated users to proceed on error
        }
    }

    // Existing logic for other routes
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    if (isPublicRoute && isAuthenticated) {
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }

    if (!isAuthenticated && !isPublicRoute) {
        return Response.redirect(new URL(ROOT, nextUrl));
    }
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)',
    ],
};