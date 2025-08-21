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
            toast.success('Voce foi logado com sucesso!');
            router.push('/checkout');
        } else {
            toast.error('Usuário e senha inválido!');
        }

        setPassword('');
        setEmail('');
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
