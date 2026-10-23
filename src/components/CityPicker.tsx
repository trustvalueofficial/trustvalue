import Link from "next/link";
import { getCities } from "@/lib/cms";

export function CityPicker({ href, title = "Choose a city" }: { href: (citySlug: string) => string; title?: string }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="chips">
        {getCities().map((c) => <Link key={c.slug} href={href(c.slug)} className="chip">{c.name}</Link>)}
      </div>
    </section>
  );
}
