import type { AnyFieldApi } from "@tanstack/react-form";
import { Label } from "./ui/label";

export function Field({
  label,
  hint,
  field,
  children,
}: {
  label: string;
  hint?: string;
  field: AnyFieldApi;
  children: React.ReactNode;
}) {
  const errors = field.state.meta.errors;
  const show = field.state.meta.isTouched && errors.length > 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={field.name}>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {show && (
        <p className="text-sm text-destructive">
          {errors
            .map((e) => (typeof e === "string" ? e : e.message))
            .join(", ")}
        </p>
      )}
    </div>
  );
}
