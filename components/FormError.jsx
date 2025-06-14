// components/FormError.tsx
export function FormError({ error }) {
  if (!error?.message) return null;
  return <p className="text-sm text-red-500">{error.message}</p>;
}
