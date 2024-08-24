import { Context } from "hono";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import { createUserNotificationsSchema, markNotificationAsReadSchema } from "../../Zod/zod";

export async function createUserNotifications(c: Context) {
    try {
        const userId = c.get("user").id;
        const { type, title, body } = await c.req.json()

        const response = createUserNotificationsSchema.safeParse({ type, title, body });

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const prisma: any = await dbConnect(c);

        const createNotification = await prisma.notification.create({
            data: {
                userId,
                type: response.data.type,
                title: response.data.title,
                body: response.data.body,
                read: false
            }
        })

        return apiResponse(c, 200, createNotification, "Notification created successfully");
    } catch (error: any) {
        console.log("Create User Notifications Error:", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getUserNotifications(c: Context) {
    try {
        const userId = c.get("user").id;

        const prisma: any = await dbConnect(c);

        const getUserNotifications = await prisma.notification.findMany({
            select: {
                id: true,
                title: true,
                body: true,
                type: true,
                read: true,
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });

        if (!getUserNotifications) {
            return apiError(c, 404, "Notifications not found")
        }

        return apiResponse(c, 200, getUserNotifications, "Notications fetched Successfully",);
    } catch (error: any) {
        console.log("Get User Notifications Error:", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function markNotificationAsRead(c: Context) {
    try {
        const notificationId = c.req.param('id')

        const response = markNotificationAsReadSchema.safeParse(notificationId);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        if (!notificationId) {
            return apiError(c, 400, "Notification ID is required");
        }

        const prisma: any = await dbConnect(c);

        const markNotificationAsRead = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                read: false
            },
            data: {
                read: true
            }
        })

        if (!markNotificationAsRead) {
            return apiError(c, 404, "Could not mark notification as read")
        }

        if(markNotificationAsRead.count===0){
            return apiError(c, 404, "Notification already marked as read")
        }

        return apiResponse(c, 200, markNotificationAsRead, "Notification marked as read successfully");
    } catch (error: any) {
        console.log("Mark Notification As Read Error:", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

