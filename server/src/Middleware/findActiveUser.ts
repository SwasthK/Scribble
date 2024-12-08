import { Context, Next } from "hono";

export async function findActiveUser(c: Context, next: Next) {
    try {
        const id = c.get('id')
        const prisma = c.get('prisma');

        const isUserExist = await prisma.user.findUnique({
            where: { id },
            include: {
                socials: {
                    select: {
                        platform: true,
                        url: true
                    }
                },
            }
        })

        if (!isUserExist) { return c.json({ error: "User not found" }, 400) }

        c.set('user', isUserExist)

        await next()
    } catch (error) {
        console.log("ERROR - Find Active User Middleware : ", error);
        return c.json({ error: "Something went wrong" }, 500)
    }
}