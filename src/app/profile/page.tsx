"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { UserCircle, Edit3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  // password fields could be added for password change functionality
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { currentUser, isLoading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login?redirect=/profile');
    }
    if (currentUser) {
      form.reset({
        name: currentUser.name || "",
        email: currentUser.email,
      });
    }
  }, [currentUser, authLoading, router, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      const success = await updateProfile(values.name, values.email);
      if (success) {
        toast({ title: "Profile Updated", description: "Your profile information has been successfully updated." });
      } else {
        toast({ title: "Update Failed", description: "Could not update profile. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({ title: "Update Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (authLoading || !currentUser) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UserCircle className="mr-2 h-7 w-7 text-primary" /> Your Profile
          </CardTitle>
          <CardDescription>View and update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add password change fields here if needed */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : <><Edit3 className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

