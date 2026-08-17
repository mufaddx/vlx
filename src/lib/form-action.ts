/** Native `<form action>` types require Promise<void>; our actions still return `{ ok, error }` at runtime. */
export function asFormAction(fn: unknown): (formData: FormData) => Promise<void> {
  return fn as (formData: FormData) => Promise<void>;
}
