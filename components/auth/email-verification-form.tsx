"use client"

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const EmailVerificationForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // handle verification 
    // wrap this in useCallback so that this only runs once or whenever its dependencies changes. so in this case, i want basiclly if the token is not there or if the form error/success message popped up then i want to run this callback
    const handleVerification = useCallback(() => {
        if (success || error) return
        if (!token) {
            setError("No token found")
            return
        }
        newVerification(token).then(data => {
            if (data.error) {
                setError(data.error)
            }
            if (data.success) {
                setSuccess(data.success)
                router.push("/auth/login")
            }
        })
    }, [error, router, success, token])

    // we will run it once when the component mount
    useEffect(() => {
        handleVerification()
    }, [handleVerification])
    return (
        <AuthCard backButtonHref="/auth/login" backButtonLabel="Back to login" cardTitle="Verify your account.">
            <div className="flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? "Verifying email..." : null}</p>
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </AuthCard>
    )
}