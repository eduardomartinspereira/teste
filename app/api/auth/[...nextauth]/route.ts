/* eslint-disable  @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // ------------------ GOOGLE (Gmail) ------------------
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            // opcional: limitar a prompt/escopos se quiser
            // authorization: { params: { prompt: 'select_account', access_type: 'offline', response_type: 'code' } }
        }),

        // ------------------ CREDENTIALS ------------------
        Credentials({
            name: 'Email e senha',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user?.password) return null;

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
                    // image: user.image ?? undefined,
                } as any;
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                // Garante que existe um User com este e-mail
                if (!user?.email) return false;

                const name = user.name ?? '';
                const [firstName, ...rest] = name.split(' ');
                const lastName = rest.join(' ');

                await prisma.user.upsert({
                    where: { email: user.email },
                    create: {
                        email: user.email,
                        firstName: firstName,
                        lastName,
                        role: 'CUSTOMER',
                    },
                    update: {
                        firstName: firstName,
                        lastName,
                    },
                });
            }
            return true;
        },

        /**
         * jwt: injeta id/role no token sempre que possível
         */
        async jwt({ token, user, account }) {
            // Quando fizer login, preferimos dados “frescos”
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: {
                        id: true,
                        role: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                        email: true,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.name =
                        [dbUser.firstName, dbUser.lastName]
                            .filter(Boolean)
                            .join(' ') || token.name;
                    token.picture = dbUser.image ?? token.picture;
                    token.email = dbUser.email;
                }
            } else if (token?.email) {
                // Navegação pós-login: recarrega do banco
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    select: {
                        id: true,
                        role: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                        email: true,
                    },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.name =
                        [dbUser.firstName, dbUser.lastName]
                            .filter(Boolean)
                            .join(' ') || token.name;
                    token.picture = dbUser.image ?? token.picture;
                    token.email = dbUser.email;
                }
            }

            return token;
        },

        /**
         * session: expõe id/role na session.user
         */
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                session.user.name = token.name ?? session.user.name;
                session.user.image =
                    (token as any).picture ?? session.user.image;
                session.user.email = token.email ?? session.user.email;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
