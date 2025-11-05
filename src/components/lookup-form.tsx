
'use client';

import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LoaderCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="h-14 w-28" disabled={pending}>
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Search />
      )}
      <span className="ml-2">{pending ? 'Checking' : 'Check'}</span>
    </Button>
  );
}

export default function LookupForm({ formAction }: { formAction: (payload: FormData) => void }) {
  return (
    <form action={formAction} className="flex gap-2 items-center">
      <Input
        type="text"
        name="domain"
        placeholder="e.g., example.com or 8.8.8.8"
        className="text-lg h-14 bg-card/80 border-2 border-border focus:border-primary transition-colors"
        required
      />
      <SubmitButton />
    </form>
  );
}
