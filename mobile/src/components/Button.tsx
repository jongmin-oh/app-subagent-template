import type { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  variant?: "primary" | "secondary" | "danger";
};
export function Button({
  title,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`button ${variant} ${className}`}
      {...props}
    >
      {title}
    </button>
  );
}
