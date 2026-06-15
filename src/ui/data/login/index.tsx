
'use client';

import { Button } from '@components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/card';
import { Input } from '@components/input';
import { useToast } from '@interfaces/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormSchema } from '@services/auth/definitions';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';

// Menggunakan instance Axios Anda secara langsung
import SatellitePublic from '@services/satellite/public'; 

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setErrorMessage('');
    
    try {
      // Menembak langsung ke API menggunakan SatellitePublic
      const res = await SatellitePublic.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const response = res.data;

      if (response.success || response.data) {
        toast({
          variant: 'success',
          title: 'Login Berhasil',
          description: response.message || 'Selamat datang!',
        });

        const user = response.data;
        const userRole = user?.role;
        const token = user?.access_token;

        if (!token) {
           console.error("Token kosong:", response);
           alert("Gagal mengambil token login.");
           return;
        }

        // Set Cookie
        document.cookie = `TOKEN_AUTH=${token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `USER_NAME=${user.name}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `USER_EMAIL=${user.email}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `USER_ROLE=${userRole}; path=/; max-age=86400; SameSite=Lax`;

        if (userRole === 'Admin' || userRole === 'admin') {
          router.replace('/dashboard');
          router.refresh();
        } else {
          window.location.href = `https://website-public-main.vercel.app/?token=${token}`; 
        }
      }
    } catch (error: any) {
      console.error('LOGIN ERROR:', error);
      let errorMsg = 'Terjadi kesalahan saat login.';
      
      if (error.response) {
        errorMsg = error.response.data?.message || 'Email atau password salah.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Server tidak terjangkau. Pastikan server backend menyala.';
      }

      setErrorMessage(errorMsg);
      toast({
        variant: 'failed',
        title: 'Login Gagal',
        description: errorMsg,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Welcome to Login Page Asrama Kutai Kartanegara - Admin
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            
            {errorMessage && (
              <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">
                {errorMessage}
              </div>
            )}

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Email</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0'
                      placeholder='Enter Email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0'
                        placeholder='Enter Password'
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size={null as any}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting}
              type="submit"
              variant='outline'
              size={null as any}
              className='mt-4 w-full bg-slate-100 hover:bg-gold hover:text-blonde dark:bg-slate-500 dark:text-white dark:hover:text-white border-0 p-2'
            >
              <LogIn className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
              <span className='ml-1 '>{isSubmitting ? 'Submitting...' : 'Login'}</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}