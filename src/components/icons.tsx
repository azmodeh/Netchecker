
import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Global NetCheck Vista Logo</title>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 2c-2.48 2.22-4 5.44-4 9 0 3.56 1.52 6.78 4 9 .8-1 1.5-2.1 2-3.3" />
      <path d="M22 12c-2.48-2.22-4-5.44-4-9" />
       <path d="M2 12h20" />
    </svg>
  );
}
