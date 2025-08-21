import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LogoutButton from '../components/LogoutButton';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    console.log(session);

    if (!session) {
        redirect('/');
    }

    return (
        <div>
            <h1>Se você está vendo essa página, você está logado</h1>
            <p>Olá, {session.user?.name ?? session.user?.email}</p>
            <small>
                UserID: {(session.user as any)?.id} • Role:{' '}
                {(session.user as any)?.role}
            </small>
            <div className="mt-4">
                <LogoutButton />
            </div>
        </div>
    );
}
