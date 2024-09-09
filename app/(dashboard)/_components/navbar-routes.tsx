"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  const onClick = () => {
    router.push("/sign-in");
  };
  return (
    <div className="flex gap-x-4">
      <SignedIn>
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button variant="outline" size="sm" type="button" onClick={onClick}>
          <LogIn size={15} className="mr-2" />
          Login
        </Button>
      </SignedOut>
    </div>
  );
};
