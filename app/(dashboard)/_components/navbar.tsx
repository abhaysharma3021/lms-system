import { Logo } from "./logo";
import MobileSidebar from "./mobile-sidebar";
import { NavbarRoutes } from "./navbar-routes";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white justify-between">
      <div className="p-2">
        <div className="hidden lg:block">
          <Logo />
        </div>
        <MobileSidebar />
      </div>
      <NavbarRoutes />
    </div>
  );
};
