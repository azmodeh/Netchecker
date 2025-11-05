
'use client';

import { useActionState } from 'react';
import { performGlobalCheck } from '@/lib/actions';
import type { FormState } from '@/lib/types';
import Background from '@/components/background';
import LookupForm from '@/components/lookup-form';
import ResultsDisplay from '@/components/results-display';
import { LogoIcon } from '@/components/icons';

const initialState: FormState = {};

export default function Home() {
  const [state, formAction] = useActionState(performGlobalCheck, initialState);

  return (
    <>
      <Background />
      <main className="container mx-auto px-4 py-10 relative z-10 min-h-screen">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
             <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Global NetCheck Vista
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Network Intelligence Platform
          </p>
        </header>

        <section className="max-w-4xl mx-auto mb-10 liquid-glass p-10">
          <div className="liquid-gradient p-8 mb-8">
            <div className="relative z-[1]">
              <label className="block mb-3 font-semibold text-foreground">
                IP Address or Domain
              </label>
              <LookupForm formAction={formAction} />
            </div>
          </div>

          <section key={state.timestamp}>
            <ResultsDisplay state={state} />
          </section>

        </section>

        <footer className="text-center mt-16 text-sm text-muted-foreground p-6 border-t border-primary/20 animated-footer">
          <p>Powered by AI. Checks performed from multiple global nodes.</p>
        </footer>
      </main>
    </>
  );
}
