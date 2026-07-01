import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@components/command';
import { menuItems } from '@constant/condition/general';
import Link from 'next/link';

const Sidebar = () => {
  return (
    // 🔥 UBAH: Background menjadi KUNING (#FCE124)
    <div className="mt-4 text-sm">
      <Command className="bg-[#FCE124] rounded-none px-4 flex flex-col gap-2 min-h-screen border-r border-black/10">
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {menuItems.map((item, index) => (
            <CommandItem 
              key={index} 
              // 🔥 UBAH: Hover menjadi KUNING LEBIH GELAP (#FFD700)
              className="my-4 hover:bg-[#FFD700] rounded-lg transition-colors duration-200"
            >
              <item.icon className="mr-[32px] h-6 w-6 text-black" />
              <Link href={item.link} className="hidden lg:block">
                <span className="text-black font-medium" suppressHydrationWarning>
                  {item.label}
                </span>
              </Link>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default Sidebar;