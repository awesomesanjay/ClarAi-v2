'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import ClarAIForm from '@/components/ClarAIForm';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
    const [result, setResult] = useState(null);

    return (
        <main className="container min-h-screen py-20">
            <Hero />

            <div className="max-w-2xl mx-auto">
                {!result ? (
                    <ClarAIForm onResult={setResult} />
                ) : (
                    <ResultDisplay content={result} onReset={() => setResult(null)} />
                )}
            </div>

            <footer className="text-center text-sm text-muted mt-20 opacity-50">
                &copy; {new Date().getFullYear()} ClarAI v2. Built for clarity.
            </footer>
        </main>
    );
}
