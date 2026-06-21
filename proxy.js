import { withAuth } from 'next-auth/middleware';

const authMiddleware = withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export function proxy(req, event) {
  return authMiddleware(req, event);
}

export const config = {
  matcher: ['/admin/:path*'],
};
