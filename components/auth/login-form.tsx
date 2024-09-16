"use client"

import { AuthCard } from "./auth-card"

export const LoginForm = () => {
    return (
        <AuthCard cardTitle="Welcome Back!" backButtonHref="/auth/register" backButtonLabel="Create a new account" showSocials>
            <div>
                <h1>Form</h1>
            </div>
        </AuthCard>
    )
}