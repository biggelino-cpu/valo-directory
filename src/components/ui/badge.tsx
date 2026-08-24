import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "font-label inline-flex items-center rounded-sm border px-2.5 py-1",
  {
    variants: {
      variant: {
        default: "border-border text-muted-foreground",
        accent: "border-transparent bg-primary text-primary-foreground",
        outline: "border-border text-muted-foreground",
        solid: "border-transparent text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
