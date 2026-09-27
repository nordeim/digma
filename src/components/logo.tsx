import { cn } from "@/lib/utils";

// The Digma brand mark (measured from the reference): a dark rounded square
// carrying a 2×2 of colored squares. Pure inline SVG so it renders anywhere
// (header, mobile sheet, favicon, metadata) with zero network requests.

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#0F172A" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="#2ECC8A" />
      <rect x="17" y="7" width="8" height="8" rx="2" fill="#3B82F6" />
      <rect x="7" y="17" width="8" height="8" rx="2" fill="#8B5CF6" />
      <rect x="17" y="17" width="8" height="8" rx="2" fill="#F59E0B" />
    </svg>
  );
}
