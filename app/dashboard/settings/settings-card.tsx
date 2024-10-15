"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SettingsSchema } from "@/types/settings-schema"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { settings } from "@/server/actions/settings"
import { UploadButton } from "@/app/api/uploadthing/upload"

type SettingsForm = {
  session: Session
}

export default function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
      image: session.session.user?.image || undefined,
    }
  })

  // using the settings action
  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data?.success) setSuccess(data.success)
      if (data?.error) setError(data.error)
    },
    onError: (error) => {
      setError("Something went wrong")
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    // do something with the form values
    execute(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={status === "executing"} {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image className="rounded-full" src={form.getValues("image")!} width={42} height={42} alt="User Image" />
                    )}
                    <UploadButton className="scale-75 ut-button:ring-primary ut-label:bg-red-50  ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden" endpoint="avatarUploader" onUploadBegin={() => {
                      setAvatarUploading(true)
                    }} onUploadError={(error) => {
                      form.setError("image", {
                        type: "validate",
                        message: error.message,
                      })
                      setAvatarUploading(false)
                      return
                    }} onClientUploadComplete={(res) => {
                      form.setValue("image", res[0].url!)
                      setAvatarUploading(false)
                      return
                    }} content={{
                      button({ ready }) {
                        if (ready) return <div>Change Avatar</div>
                        return <div>Uploading...</div>
                      },
                    }} />
                  </div>
                  <FormControl>
                    <Input placeholder="User Image" type="hidden" disabled={status === "executing"} {...field} />
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
                    <Input placeholder="********" disabled={status === "executing" || session.session.user.isOAuth === true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" disabled={status === "executing" || session.session.user.isOAuth === true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  */}
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch disabled={status === "executing" || session.session.user.isOAuth === true} checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={status === "executing" || avatarUploading}>Update your settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}