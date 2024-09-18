"use server"

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"

const action = createSafeActionClient()

export const emailRegister = action(RegisterSchema, async ({ email, password, name}) => {
    
})