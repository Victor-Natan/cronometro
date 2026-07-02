import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/desenhos", label: "Desenhos" },
  { href: "/diario", label: "Diário" },
  { href: "/memoria", label: "Memória" },
  { href: "/declaracoes", label: "Declarações" },
  { href: "/historias", label: "Histórias" },
];

export default function Header() {
  return (
    <header className="bg-sky-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/plantinhaimg.png" alt="Plantinha" width={56} height={56} priority />
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">Plantinha</p>
            <p className="text-xl font-semibold">Memórias e carinho</p>
          </div>
        </Link>
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-3 text-sm sm:gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3 py-2 text-white transition hover:bg-white/10">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
