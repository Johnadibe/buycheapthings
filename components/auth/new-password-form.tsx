"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import { AuthCard } from "./auth-card"
import * as z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import {useAction} from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { newPassword } from "@/server/actions/new-password"
import { useSearchParams } from "next/navigation"

export const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "", 
        }
    });

    // grab the token from the url using useSearchParams
    const token = useSearchParams().get("token")

    // create a state for error and success
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // using the new-password.ts action
    const {execute, status} = useAction(newPassword, {
        onSuccess(data){
            if(data?.error) setError(data.error)
            if(data?.success) setSuccess(data.success)
        }
    })

    // create onSubmit function
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        // do something with the form values
        execute( {password: values.password, token} )
    }
    return (
        <AuthCard cardTitle="Enter a new password" backButtonHref="/auth/login" backButtonLabel="Back to login" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>

  {/* Password */}
  <FormField
    control={form.control}
    name="password"
    render={({field}) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          { /* Your form field */}
          <Input placeholder="*********" {...field} type="password" autoComplete="current-password" disabled={status === "executing"}/>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
  <FormSuccess message={success}/>
  <FormError message={error} />
  <Button variant={"link"} size={"sm"}>
    <Link href="/auth/reset">Forgot your password?</Link>
  </Button>
                        </div>
  <Button type="submit" className={cn("w-full", status === "executing" ? "animate-pulse" : "")}>Reset Password</Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}