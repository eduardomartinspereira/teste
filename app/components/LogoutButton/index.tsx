'use client';

import { signOut } from 'next-auth/react';
import React, { ButtonHTMLAttributes } from 'react';

export default function LogoutButton(
    props: ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <button
            {...props}
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-500 text-white rounded"
        >
            Sair
        </button>
    );
}
