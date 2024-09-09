import { Logo } from "./logo";
import SidebarRoutes from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white py-1">
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
