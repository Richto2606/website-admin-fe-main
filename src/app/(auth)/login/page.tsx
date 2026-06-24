'use client';

import { Button } from '@components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/card';
import { Input } from '@components/input';
import { useToast } from '@interfaces/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormSchema } from '@services/auth/definitions';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import SatellitePublic from '@services/satellite/public'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/tabs';
import ThemeToggler from "@ui/theme/ThemeToggler";
import { RegisterForm } from "@ui/data/register";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setErrorMessage('');
    try {
      const res = await SatellitePublic.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const response = res.data;
      if (response.success || response.data) {
        const user = response.data;
        const token = user?.access_token;

        if (!token) {
           alert("Gagal mengambil token login.");
           return;
        }

        // Simpan token di localStorage (PENTING)
        localStorage.setItem('token', token);

        toast({ variant: 'success', title: 'Login Berhasil', description: 'Selamat datang!' });

        if (user?.role === 'Admin' || user?.role === 'admin') {
          router.replace('/dashboard');
        }
      }
    } catch (error: any) {
      setErrorMessage('Email atau password salah.');
      toast({ variant: 'failed', title: 'Login Gagal', description: 'Cek kembali kredensial Anda.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Welcome to Login Page Asrama Kutai Kartanegara - Admin</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            {errorMessage && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">{errorMessage}</div>}
            <FormField control={form.control} name='email' render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input placeholder='Enter Email' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='password' render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input type={showPassword ? 'text' : 'password'} placeholder='Enter Password' {...field} />
                    <Button type="button" variant="ghost" className="absolute top-1/2 right-3 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button disabled={isSubmitting} type="submit" className='w-full'>
              <LogIn className='mr-2 h-4 w-4' /> {isSubmitting ? 'Submitting...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className='h-full mt-20 flex items-center justify-center relative'>
      <div className='absolute bottom-5 right-0'><ThemeToggler /></div>
      <Tabs defaultValue='login' className='w-[500px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>Login</TabsTrigger>
          <TabsTrigger value='register'>Register</TabsTrigger>
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