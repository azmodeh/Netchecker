
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
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">
              Global NetCheck Vista
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter a domain to perform a global network check and visualize the results.
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-12">
          <LookupForm formAction={formAction} />
        </div>
        
        <ResultsDisplay key={state.timestamp} state={state} />
      </main>
    </>
  );
}
