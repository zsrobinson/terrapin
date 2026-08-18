import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { Field } from "~/components/Field";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { insertOrgFn, insertOrgSchema } from "~/lib/org";

export const Route = createFileRoute("/_app/create")({
  component: RouteComponent,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { slug: "", name: "", description: "" },
    validators: { onBlur: insertOrgSchema },
    onSubmit: async ({ value }) => {
      await insertOrgFn({ data: value });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      navigate({ to: "/$org", params: { org: value.slug } });
    },
  });

  return (
    <div className="p-8 max-w-lg mx-auto flex flex-col gap-4">
      <h2 className="font-semibold text-xl">Create Organization</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field name="name">
          {(field) => (
            <Field label="Name" field={field}>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (!form.getFieldMeta("slug")?.isDirty) {
                    form.setFieldValue("slug", slugify(e.target.value), {
                      dontUpdateMeta: true,
                    });
                  }
                }}
                placeholder="Writing Club"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="slug">
          {(field) => (
            <Field label="URL" field={field}>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="font-mono"
                placeholder="writing-club"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <Field label="Description" hint="Optional" field={field}>
              <Textarea
                id={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="What does your org do?"
              />
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="self-end">
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                  Loading…
                </>
              ) : (
                <>
                  <PlusIcon data-icon="inline-start" />
                  Create
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
