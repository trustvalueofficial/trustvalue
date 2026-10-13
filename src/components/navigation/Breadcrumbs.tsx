import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="breadcrumb-nav flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-[#667085] py-3 max-w-[60vw] md:max-w-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#FF5A0A] transition-colors flex-shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight className="w-3.5 h-3.5 text-[#C5CEDC] flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="text-[#071B46] font-semibold truncate max-w-[calc(60vw-36px)] md:max-w-[260px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#FF5A0A] transition-colors truncate max-w-[calc(60vw-36px)] md:max-w-[260px]"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
