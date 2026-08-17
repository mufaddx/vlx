export default function Placeholder({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-xl text-mist-500">{body}</p>
    </div>
  );
}
