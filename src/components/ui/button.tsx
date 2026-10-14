import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-blue-800",
        navy: "bg-navy text-white hover:bg-ink",
        outline: "border border-slate-200 bg-white text-navy hover:bg-slate-50",
        ghost: "bg-transparent text-brand hover:bg-blue-50",
        danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
      },
      size: {
        md: "h-11 px-4 text-sm",
        lg: "h-12 w-full px-4 text-[15px]",
        sm: "h-10 px-3 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
