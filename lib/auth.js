import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const { default: dbConnect } = await import('@/lib/db/connect');
        const { default: Admin } = await import('@/lib/db/models/Admin');

        try {
          await dbConnect();
          const admin = await Admin.findOne({ email: credentials.email.toLowerCase() });
          if (admin) {
            const isValid = await admin.comparePassword(credentials.password);
            if (isValid) {
              return {
                id: admin._id.toString(),
                email: admin.email,
                name: admin.name || 'Admin',
              };
            }
          }
        } catch {
          // DB unavailable — fall through to env var check
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || 'Admin';

        if (adminEmail && adminPassword) {
          const emailMatch = credentials.email.toLowerCase() === adminEmail.toLowerCase();
          const passwordMatch = credentials.password === adminPassword;

          if (emailMatch && passwordMatch) {
            return {
              id: 'admin',
              email: adminEmail,
              name: adminName,
            };
          }
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },
};
