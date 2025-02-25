"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthCard } from "./auth-card"
import { LoginSchema } from "@/types/login-schema"
import * as z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { emailSignIn } from "@/server/actions/email-signin"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"


export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // create a state for error and success
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  // using the email-signin action
  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)
      if (data.twoFactor) setShowTwoFactor(true)
    }
  })

  // create onSubmit function
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // do something with the form values
    execute(values)
  }
  return (
    <AuthCard cardTitle="Welcome back!" backButtonHref="/auth/register" backButtonLabel="Create a new account" showSocials>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>We&#39;ve sent you a two factor code to your email.</FormLabel>
                      <FormControl>
                        { /* Your form field */}
                        <InputOTP disabled={status === "executing"} {...field} maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          { /* Your form field */}
                          <Input placeholder="johnadibe123@gmail.com" {...field} type="email" autoComplete="email" />
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          { /* Your form field */}
                          <Input placeholder="*********" {...field} type="password" autoComplete="current-password" />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button variant={"link"} size={"sm"}>
                <Link href="/auth/reset">Forgot your password?</Link>
              </Button>
            </div>
            <Button type="submit" className={cn("w-full", status === "executing" ? "animate-pulse" : "")}>{showTwoFactor ? "Verify" : "Sign In"}</Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}