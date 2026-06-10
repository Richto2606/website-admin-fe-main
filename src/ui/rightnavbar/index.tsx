'use client';

import React, { useEffect, useState } from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@components/avatar';
import ThemeToggler from '@ui/theme/ThemeToggler';
import { ChevronDown, Bell } from 'lucide-react';
import DynamicText from '@components/particel/dynamic-text';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@components/dropdown-menu';
import Link from 'next/link';
import CustomText from '@components/particel/custom-text';
import { deleteCookies, logout } from '@services/auth/01-auth';
import { useToast } from '@interfaces/use-toast';
import { formatMessage } from '@interfaces/data-types';
import { useRouter } from 'next/navigation'; // <-- 1. Import useRouter
import { getCookiesStoreEmail, getCookiesStoreRole, getCookiesStoreUserName } from '@store/cookiesStore';

const RightNavBar = () => {
  const { toast } = useToast();
  const router = useRouter(); // <-- 2. Deklarasikan router di sini
  const [currentDate, setCurrentDate] = useState(new Date());
  const [username, setUsername] = useState<string>('User Name');
  const [email, setEmail] = useState<string>('email@gmail.com');
  const [role, setRole] = useState<string>('Admin');

  useEffect(() => {
    const fetchCookies = async () => {
      const storedUsername = await getCookiesStoreUserName();
      setUsername(storedUsername || 'User Name');

      const storedEmail = await getCookiesStoreEmail();
      setEmail(storedEmail || 'email@gmail.com');

      const storedRole = await getCookiesStoreRole();
      setRole(storedRole || 'Admin');
    };

    fetchCookies();

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let formattedTime = currentDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  formattedTime = formattedTime.replace(/\./g, ':');

  const handleLogout = async () => {
    try {
      const logoutResponse : formatMessage = await logout();
      if(logoutResponse.success){
        await deleteCookies(); // Tambahkan await agar cookie benar-benar terhapus dulu
        
        toast({
          variant: 'success',
          title: 'Logout',
          description: logoutResponse.message
        });

        // 3. Gunakan router.push ke /login
        setTimeout(() => {
          router.push('/login'); 
          router.refresh(); // Refresh agar middleware Next.js sadar cookie sudah hilang
        }, 1000);

      } else {
        toast({
          variant: 'failed',
          title: 'Logout',
          description: logoutResponse.message
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
        <CustomText 
          text={formattedDate} 
          textSize={'sm'} 
        />
        <hr className="h-6 border-[1px]" />
        <CustomText 
          text={`${formattedTime} WIB`} 
          textSize={'sm'} 
          textWeight={'semibold'} 
          outline={true} 
          classNameText={'px-2 py-1 rounded text-gold bg-blonde border-yellow border-[1.5px]'}
        />
        <Bell className='h-4 w-4 dark:text-blonde dark:fill-blonde text-[#CCBB22]' fill='#CCBB22'/>
        <ThemeToggler />
        <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='user' />
            <AvatarFallback className='text-black'>BT</AvatarFallback>
        </Avatar>
        <DynamicText
            text={username}
            subText={`Admin (Email: ${email})`}
        />
        <CustomText 
          text={'Online'} 
          textSize={'xs'} 
          textWeight={'semibold'} 
          outline={true} 
          classNameText={'px-2 py-1 rounded text-green bg-background border-green border-[0.5px]'}
        />
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none'>
                <ChevronDown className='dark:text-blonde text-[#CCBB22]' size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href='/profile'>Profile</Link>
                </DropdownMenuItem>
                {/* Pastikan memanggil fungsinya seperti ini */}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  );
};

export default RightNavBar;