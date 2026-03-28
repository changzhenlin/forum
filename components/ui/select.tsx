import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-[#f8fafc] px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}
