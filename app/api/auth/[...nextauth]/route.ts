import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';

export const authOptions = {
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            name: 'Email e senha',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                console.log('entrei no next-auth VITALIS');

                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;
                const ok = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!ok) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.firstName ?? undefined,
                    lastName: user.lastName ?? undefined,
                    role: user.role,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
