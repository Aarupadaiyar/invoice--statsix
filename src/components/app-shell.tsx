"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Settings, Plus, Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { BrandLogo } from "@/components/brand-logo";
import { btnGhost } from "@/lib/ui";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings/business", label: "Business Profile", icon: Settings },
];

export function AppShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex-1 flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-black/5 flex flex-col transform transition-transform lg:translate-x-0 lg:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-black/5">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <BrandLogo />
            Statsix Invoice
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <Link
            href="/documents/new/invoice"
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="size-4" /> New Invoice
          </Link>
          <Link
            href="/documents/new/receipt"
            className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5"
          >
            <Plus className="size-4" /> New Receipt
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-accent/10 text-accent" : "text-black/70 hover:bg-black/5"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <p className="text-xs text-black/40 mb-2 truncate">{email}</p>
          <LogoutButton className={`${btnGhost} w-full justify-start !px-2`} />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-14 flex items-center gap-3 px-4 border-b border-black/5 bg-white sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </button>
          <span className="font-semibold">Statsix Invoice</span>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
