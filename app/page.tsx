'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../styles/page.module.scss';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        setLoading(false);

        if (result?.ok) {
            toast.success('Você foi logado com sucesso!');
            router.push('/checkout');
        } else {
            toast.error('Usuário e senha inválido!');
        }

        setPassword('');
        setEmail('');
    };

    const handleGoogle = async () => {
        // redireciona para o fluxo do Google (sem toast porque há redirect)
        await signIn('google', { callbackUrl: '/checkout' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.centerBox}>
                <div className={styles.header}>
                    <img
                        src="https://dashboard.kiwify.com/_nuxt/img/kiwify-green-logo.3059fc8.svg"
                        alt="Kiwify Logo"
                        className={styles.logo}
                    />
                    <h2 className={styles.title}>Entrar na sua conta</h2>
                    <p className={styles.subtitle}>
                        Ou{' '}
                        <a href="#" className={styles.linkPrimary}>
                            fazer cadastro
                        </a>
                    </p>
                </div>
            </div>

            <div className={styles.centerBox}>
                <div className={styles.card}>
                    {/* Botão Google */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        className={`${styles.buttonPrimary} ${styles.buttonGoogle}`}
                        style={{ marginBottom: 12 }}
                    >
                        {/* Ícone do Google em SVG */}
                        <svg
                            aria-hidden="true"
                            width="18"
                            height="18"
                            viewBox="0 0 48 48"
                            style={{ marginRight: 8 }}
                        >
                            <path
                                fill="#FFC107"
                                d="M43.611 20.083H42V20H24v8h11.303C33.602 32.545 29.24 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.67 6.053 29.632 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.493 0 19.128-7.614 19.128-20 0-1.341-.138-2.646-.407-3.917z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.306 14.691l6.571 4.819C14.4 16.087 18.84 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.67 6.053 29.632 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24 44c5.163 0 9.938-1.978 13.532-5.193l-6.238-5.284C29.212 35.81 26.74 36.8 24 36c-5.224 0-9.576-3.43-11.163-8.084l-6.532 5.028C9.635 39.556 16.248 44 24 44z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.611 20.083H42V20H24v8h11.303c-1.067 3.257-3.733 5.795-6.971 6.523l6.238 5.284C36.127 40.104 44 34.5 44 24c0-1.341-.138-2.646-.389-3.917z"
                            />
                        </svg>
                        Entrar com Google
                    </button>

                    {/* Separador */}
                    <div
                        className={styles.separator}
                        style={{ textAlign: 'center', margin: '8px 0 16px' }}
                    >
                        ou
                    </div>

                    {/* Form Credentials */}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${styles.input} mask-user-input`}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.rowRight}>
                            <a href="#" className={styles.linkPrimarySmall}>
                                Esqueceu a senha?
                            </a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={styles.buttonPrimary}
                            >
                                {loading ? 'Carregando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
