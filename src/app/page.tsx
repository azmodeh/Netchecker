'use client';

import { useActionState } from 'react';
import { performGlobalCheck } from '@/lib/actions';
import type { FormState } from '@/lib/types';
import LookupForm from '@/components/lookup-form';
import ResultsDisplay from '@/components/results-display';
import { LogoIcon } from '@/components/icons';
import Background from '@/components/background';

const initialState: FormState = {};

export default function Home() {
  const [state, formAction] = useActionState(performGlobalCheck, initialState);

  return (
    <>
      <Background />
      <main className="container mx-auto px-4 py-10 relative z-10 min-h-screen flex flex-col">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold font-display text-foreground">
              Global NetCheck Vista
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              An AI-powered network intelligence platform for global performance analysis.
            </p>
        </header>

        <section className="max-w-4xl mx-auto mb-10 glass-card p-8 w-full">
          <div className="relative z-[1]">
              <label htmlFor="domain-input" className="block mb-3 font-semibold text-foreground text-lg">
                Check IP or Domain
              </label>
              <LookupForm formAction={formAction} />
            </div>

          <section key={state.timestamp}>
            <ResultsDisplay state={state} />
          </section>

        </section>

        <footer className="text-center mt-auto text-sm text-muted-foreground p-6 border-t border-primary/20 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-background bg-[length:200%_auto] animate-footer-gradient opacity-50"></div>
          <p className="relative z-10">Powered by a global network of check nodes. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
