import z from "zod";

const sendNotificationsToUserZodSchema = z.object({
    body: z.object({
        title: z.string(),
        message: z.string(),
        target: z.enum(["active_subscribers", "inactive_users", "all_users"]),
        type: z.enum(["booking", "payment", "general", "subscription", "review", "user"])
    })
})

export const NotificationValidation = {
    sendNotificationsToUserZodSchema,
}