import { Context } from "hono";

interface existingUserType {
    c: Context;
    prisma: any;
    email: string;
    username: string;
}

export async function existingUser({ c, prisma, email, username }: existingUserType) {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            return { response: "User or Email already exists", error: null }
        }
        return { response: null, error: null }
    } catch (error) {
        return { response: null, error: "Something went wrong" }
    }
}