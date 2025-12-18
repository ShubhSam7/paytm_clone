import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signin = () => {
  const formSchema = z.object({
    username: z.string().email().max(50).min(2),
    password: z.string().min(1),
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 1000; // 1 second minimum

    try {
      const response = await fetch("http://localhost:3000/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signin failed");
      }

      // Ensure minimum loading time of 1 second
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      console.log("Signin success:", result);
      // Store token if needed (optional)
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      navigate("/dashboard");
    } catch (error) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      console.error("Signin error:", error.message);
      alert(error.message || "Signin failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <div className="w-full max-w-md border-2 border-black rounded-lg p-6 shadow-lg">
        <div className="flex justify-center font-bold text-2xl mb-5">
          Sign In
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
