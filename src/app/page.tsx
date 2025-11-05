
'use client';

import { useActionState } from 'react';
import { performGlobalCheck } from '@/lib/actions';
import type { FormState } from '@/lib/types';
import { LogoIcon } from '@/components/icons';
import Background from '@/components/background';
import LookupForm from '@/components/lookup-form';
import ResultsDisplay from '@/components/results-display';

const initialState: FormState = {};

export default function Home() {
  const [state, formAction] = useActionState(performGlobalCheck, initialState);

  return (
    <>
      <Background />
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <LogoIcon className="w-16 h-16 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              Global NetCheck Vista
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Enter a domain or IP to analyze its network performance and accessibility from key locations around the world.
          </p>
        </header>

        <section className="max-w-2xl mx-auto mb-12">
          <LookupForm formAction={formAction} />
        </section>

        <section key={state.timestamp}>
          <ResultsDisplay state={state} />
        </section>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by AI. Checks performed from multiple global nodes.</p>
        </footer>
      </main>
    </>
  );
}
