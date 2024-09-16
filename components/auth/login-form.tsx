"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import { AuthCard } from "./auth-card"
import { LoginSchema } from "@/types/login-schema"
import * as z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"

export const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "", 
        }
    });

    // create onSubmit function
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        // do something with the form values
        console.log(values)
    }
    return (
        <AuthCard cardTitle="Welcome back!" backButtonHref="/auth/register" backButtonLabel="Create a new account" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                           <FormField
    control={form.control}
    name="email"
    render={({field}) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          { /* Your form field */}
          <Input placeholder="johnadibe123@gmail.com" {...field} type="email" autoComplete="email"/>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Password */}
  <FormField
    control={form.control}
    name="password"
    render={({field}) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          { /* Your form field */}
          <Input placeholder="*********" {...field} type="password" autoComplete="current-password"/>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
  <Button variant={"link"} size={"sm"}>
    <Link href="/auth/reset">Forgot your password?</Link>
  </Button>
                        </div>
  <Button type="submit" className="w-full my-2">{"Login"}</Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}