type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{title}</p>
      {subtitle ? <p className="text-2xl font-semibold text-slate-950">{subtitle}</p> : null}
    </div>
  );
}
