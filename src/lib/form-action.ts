/** Native `<form action>` types require Promise<void>; our actions still return `{ ok, error }` at runtime. */
export function asFormAction(
  // Bound server actions have leftover args; the form still invokes them as FormData callbacks.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => Promise<unknown>,
): (formData: FormData) => Promise<void> {
  return fn as (formData: FormData) => Promise<void>;
}
