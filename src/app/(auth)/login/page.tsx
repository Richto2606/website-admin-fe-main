'use client';

export const dynamic = 'force-dynamic';
import { LoginForm } from "@ui/data/login";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@components/tabs';
import ThemeToggler from "@ui/theme/ThemeToggler";
import { RegisterForm } from "@ui/data/register";

export default function LoginPage() {
  return (
    // 🔥 TAMBAHKAN bg-white
    <div className='h-full md:max-h-md lg:max-h-lg xl:max-h-4xl mt-2 overflow-auto flex items-center justify-center relative bg-white'>
      <div className='absolute bottom-5 right-0'>
        <ThemeToggler />
      </div>
      <Tabs defaultValue='login' className='w-[500px]'>
        <TabsList className='grid w-full grid-cols-2 bg-[#FCE124]/20'>
          <TabsTrigger 
            value='login' 
            className="data-[state=active]:bg-[#FCE124] data-[state=active]:text-black text-black"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value='register' 
            className="data-[state=active]:bg-[#FCE124] data-[state=active]:text-black text-black"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
          <LoginForm />
        </TabsContent>
        <TabsContent value='register'>
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}