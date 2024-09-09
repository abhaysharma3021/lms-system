"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

const SidebarItem = ({ label, href, icon: Icon }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <Link href={href} className="w-full h-full">
      <button
        type="button"
        className={cn(
          "flex rounded-md w-full items-center group h-[48px] gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:bg-muted",
          isActive &&
            "text-slate-900 bg-muted hover:bg-muted hover:text-slate-900"
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={20}
            className={cn("text-slate-500", isActive && "text-slate-900")}
          />
          {label}
        </div>
      </button>
    </Link>
  );
};

export default SidebarItem;
