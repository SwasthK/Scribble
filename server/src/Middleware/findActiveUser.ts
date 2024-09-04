import { Context, Next } from "hono";
import { dbConnect } from "../Connection/db.connect";

export async function findActiveUser(c: Context, next: Next) {
    try {
        const id = c.get('id')
        const prisma: any = await dbConnect(c);

        const isUserExist = await prisma.user.findUnique({ where: { id } })

        //Method to check if user exist
        if (!isUserExist) {
            return c.json({ error: "User not found" }, 400)
        }

        c.set('user', isUserExist)

        await next()
    } catch (error) {
        console.log("ERROR : ", error);
        return c.json({ error: "Something went wrong" }, 400)
    }
}