'use client';
import React from 'React';
import { useSession } from 'next-auth/react';
export default function LoginPage() {
    const { data: session } = useSession();
    console.log(session);
    return (
        <div>
            <h1>Se voce estiver vendo essa pagina, voce ta logado</h1>
        </div>
    );
}
