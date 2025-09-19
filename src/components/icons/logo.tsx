import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>ArtisanAI Logo</title>
      <path
        d="M15.1512 4.16781C15.9327 4.54573 16.6346 5.05663 17.2266 5.67919C18.6678 7.20234 19.3333 9.42399 19.3333 12C19.3333 14.576 18.6678 16.7977 17.2266 18.3208C16.6346 18.9434 15.9327 19.4543 15.1512 19.8322"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.84877 4.16781C8.0673 4.54573 7.36537 5.05663 6.77338 5.67919C5.33224 7.20234 4.66669 9.42399 4.66669 12C4.66669 14.576 5.33224 16.7977 6.77338 18.3208C7.36537 18.9434 8.0673 19.4543 8.84877 19.8322"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
