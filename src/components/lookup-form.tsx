
'use client';

import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="btn-primary" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <span>Complete Network Analysis</span>
      )}
    </Button>
  );
}

export default function LookupForm({ formAction }: { formAction: (payload: FormData) => void }) {
  return (
    <form action={formAction} className="flex flex-wrap gap-4 items-center">
      <Input
        type="text"
        name="domain"
        placeholder="Enter IP address or domain..."
        className="input-field flex-1 min-w-[250px]"
        required
      />
      <SubmitButton />
    </form>
  );
}
