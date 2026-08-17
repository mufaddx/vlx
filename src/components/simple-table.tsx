export function SimpleTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-mist-400">
              {columns.map((c) => (
                <th key={c} className="py-2 pr-4">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-mist-200 dark:border-white/10">
                {r.map((c, j) => (
                  <td key={j} className="py-2 pr-4">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
