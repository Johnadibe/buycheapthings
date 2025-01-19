"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthCard } from "./auth-card"
import * as z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { ResetSchema } from "@/types/reset-schema"
import { passwordReset } from "@/server/actions/password-reset"

export const ResetForm = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });

    // create a state for error and success
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // using the new-password.ts action
    const { execute, status } = useAction(passwordReset, {
        onSuccess(data) {
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    // create onSubmit function
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        // do something with the form values
        execute(values)
    }
    return (
        <AuthCard cardTitle="Forgot your password?" backButtonHref="/auth/login" backButtonLabel="Back to login" showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            { /* Your form field */}
                                            <Input placeholder="johnadibe123@gmail.com" {...field} type="email" autoComplete="email" disabled={status === "executing"} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success} />
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