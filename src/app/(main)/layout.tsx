import Navbar from "@ui/navbar";
import Sidebar from "@ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Wrapper utama mengunci tinggi pas 1 layar (h-screen) dan dibuat flex-col
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <hr className="h-[2px] bg-gray-200 border-none" />

      {/* Kontainer Bawah (Sidebar + Content) akan mengisi sisa tinggi layar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT / SIDEBAR */}
        {/* Menggunakan <aside> untuk semantik SEO/Aksesibilitas */}
        <aside className="w-[20%] md:w-[11%] lg:w-[22%] xl:w-[20%] bg-primary overflow-y-auto">
          <Sidebar />
        </aside>

        {/* RIGHT / MAIN CONTENT */}
        {/* flex-1 otomatis mengambil seluruh sisa lebar tanpa perlu set width persen lagi */}
        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;