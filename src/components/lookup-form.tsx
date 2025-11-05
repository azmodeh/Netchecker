
'use client';

import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Search } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
         <>
          <Search />
          <span>Run Analysis</span>
        </>
      )}
    </Button>
  );
}

export default function LookupForm({ formAction }: { formAction: (payload: FormData) => void }) {
  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-4 items-center">
      <Input
        id="domain-input"
        type="text"
        name="domain"
        placeholder="e.g., 8.8.8.8 or google.com"
        className="flex-1"
        required
      />
      <SubmitButton />
    </form>
  );
}
