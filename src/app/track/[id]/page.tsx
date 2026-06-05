import { notFound } from "next/navigation";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { circuits, circuitById } from "@/data/circuits";
import { TrackView } from "./_components/TrackView";

/** Pre-render a static route for every circuit. */
export function generateStaticParams() {
  return circuits.map((c) => ({ id: c.id }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const circuit = circuitById(id);

  if (!circuit) {
    notFound();
  }

  return (
    <PageTransition>
    <main className="min-h-[calc(100vh-56px)] bg-[#0A0A0F]">
      {/* Header */}
      <header className="border-b border-[#1E1E2A] bg-[#080810] px-6 py-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
              {circuit.city}, {circuit.country}
            </p>
            <h1 className="font-[family-name:var(--font-condensed)] text-4xl font-black uppercase tracking-tight text-[#E8E8E0]">
              {circuit.name}
            </h1>
          </div>

          {/* Circuit picker */}
          <nav className="flex max-w-full flex-wrap gap-1.5 overflow-x-auto">
            {circuits.map((c) => (
              <Link
                key={c.id}
                href={`/track/${c.id}`}
                className={`rounded-sm border px-2.5 py-1 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-wider transition-colors ${
                  c.id === circuit.id
                    ? "border-[#E8001C] bg-[#2A0008] text-[#E8001C]"
                    : "border-[#1E1E2A] text-[#666680] hover:border-[#444460] hover:text-[#B0B0C0]"
                }`}
              >
                {c.city}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="p-6">
        <TrackView circuit={circuit} />
      </div>
    </main>
    </PageTransition>
  );
}
