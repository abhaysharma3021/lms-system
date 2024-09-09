import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[70px] fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:flex h-full w-72 flex-col fixed inset-y-0 z-40 pt-[70px] border-r">
        <Sidebar />
      </div>
      <main className="lg:pl-72 pt-[70px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
