import Navbar from "@ui/navbar";
import Sidebar from "@ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // 🔥 UBAH: Background utama menjadi PUTIH (bg-white)
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Navbar />
      <hr className="h-[2px] border-none" style={{ backgroundColor: '#FCE124' }} />

      {/* Kontainer Bawah (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT / SIDEBAR */}
        <aside className="w-[20%] md:w-[11%] lg:w-[22%] xl:w-[20%] bg-[#FCE124] overflow-y-auto border-r border-black/10">
          <Sidebar />
        </aside>

        {/* RIGHT / MAIN CONTENT */}
        {/* 🔥 UBAH: Background main content menjadi KUNING MUDA */}
        <main className="flex-1 p-5 overflow-y-auto bg-[#FCE124]/5">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;