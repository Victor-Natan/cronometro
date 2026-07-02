import Link from "next/link";

type Props = {
  title: string;
  summary: string;
  href: string;
  tag?: string;
};

export default function ContentCard({ title, summary, href, tag }: Props) {
  return (
    <Link href={href} className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        {tag ? <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">{tag}</span> : null}
      </div>
      <p className="mt-4 text-slate-600">{summary}</p>
      <div className="mt-6 text-sm font-medium text-sky-700">Ver detalhes →</div>
    </Link>
  );
}
