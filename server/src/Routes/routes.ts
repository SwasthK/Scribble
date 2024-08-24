import { Context, Hono } from 'hono'

//import Auth Route handlers
import { verifyUser } from '../Controllers/Auth/Verify_User'
import { signup, signin, logout, refreshAccessToken } from '../Controllers/Auth/User_Controller'
import { UpdateUserProfile } from '../Controllers/Auth/User_Update_Controller'
import { deleteUserProfile } from '../Controllers/Auth/User_Delete_Controller'
import { updateUserPassword } from '../Controllers/Auth/Password_Update_Controller'
//import Follow Route handlers
import { FollowUser, UnFollowUser } from '../Controllers/FollowUser/user.Follow.Controller'
import { getFollowersDetails, getFollowingsDetails } from '../Controllers/FollowUser/user.getFollow.Controller'
//import Blog Route handlers
import { blog } from '../Controllers/Blog_Controller'
import { updateBlog } from '../Controllers/UpdateBlog_Controller'
import { getBlog } from '../Controllers/Get_Blog'
import { getAllBlog } from '../Controllers/Get_All_Blog'
import { deleteBlog } from '../Controllers/DeleteBlog_Controller'
import { get_Blog_bulk } from '../Controllers/Bulk_Blog'
import { getBlogContent } from '../Controllers/GetBlogContent'


//Notification Route handlers
import {
    createUserNotifications,
    getUserNotifications,
    markNotificationAsRead
} from '../Controllers/Notification/user_Notification_Controller'

//MiddlwWare
import { authMiddleware } from '../Middleware/Auth'
import { findActiveUser } from '../Middleware/findActiveUser'
import { dbConnect } from '../Connection/db.connect'
import { apiResponse } from '../utils/apiResponse'
import { apiError } from '../utils/apiError'

const api = new Hono()

//Middleware
api.use('/blog/*', authMiddleware, findActiveUser)

api
    //Auth Routes
    .get('/verifyUser', authMiddleware, findActiveUser, verifyUser)
    .post('/signup', signup)
    .post('/signin', signin)
    .post('/logout', authMiddleware, findActiveUser, logout)
    .post('/refreshAccessToken', refreshAccessToken)
    .put('/updateUserProfile', authMiddleware, findActiveUser, UpdateUserProfile)
    .put('/updateUserPassword', authMiddleware, findActiveUser, updateUserPassword)
    .delete('/deleteUserProfile', authMiddleware, findActiveUser, deleteUserProfile)

    //Follow Routes
    .post('profile/:id/follow', authMiddleware, findActiveUser, FollowUser)
    .delete('profile/:id/unfollow', authMiddleware, findActiveUser, UnFollowUser)
    .get('/profile/getFollowersDetails', authMiddleware, findActiveUser, getFollowersDetails)
    .get('/profile/getFollowingsDetails', authMiddleware, findActiveUser, getFollowingsDetails)

    //Notification Routes
    .post('/notification/createUserNotifications', authMiddleware, findActiveUser, createUserNotifications)
    .get('/notification/getUserNotifications', authMiddleware, findActiveUser, getUserNotifications)
    .put('/notification/markNotificationAsRead/:id', authMiddleware, findActiveUser, markNotificationAsRead)

    //Blog Routes
    .post('/blog', blog)
    .put('/blog/updateBlog', updateBlog)
    .get('/blog/getAll', getAllBlog)
    .get('/blog/getBy/:partialSlug', getBlog)
    .get('/blog/getBlogContent/:partialSlug', getBlogContent)
    .get('/blog/bulk', get_Blog_bulk)
    .delete('/blog/:id', deleteBlog)


    .get('followers', async (c: Context) => {
        const prisma: any = await dbConnect(c);
        const id = '05409e56-0cf7-4073-a991-307d21382e61';

        const data = await prisma.follower.findMany({
            where: { followerId: id },
            include: {
                follower: {
                    select: {
                        username: true
                    }
                },
                following: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return apiResponse(c, 200, { data });
    })

    //all data
    .get('/alldetails', async (c: Context) => {
        const userId = '05409e56-0cf7-4073-a991-307d21382e61'.toString()
        const prisma: any = await dbConnect(c);

        try {
            const userWithDetails = await prisma.user.findMany({

                select: {
                    username: true,
                    id: true,
                    followers: {
                        select: {
                            following: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    },
                    following: {
                        select: {
                            follower: {
                                select: {
                                    username: true
                                }
                            },
                        }
                    }
                }

            });

            if (!userWithDetails) {
                return apiError(c, 404, "User not found");
            }

            const formattedData = userWithDetails.map((user: any) => ({
                username: user.username,
                followers: user.followers.map((f: any) => f.following.username),
                following: user.following.map((f: any) => f.follower.username)
            }));

            return apiResponse(c, 200, userWithDetails, "User details fetched successfully");



        } catch (error: any) {
            console.log('Fetch User Details Error:', error.message);
            return apiError(c, 500, "Internal Server Error", { code: "CE" });
        }
    });

//     .delete ('/delete', async (c: Context) => {
//     const prisma: any = await dbConnect(c);
//     const data = await prisma.user.deleteMany({
//     });
//     return apiResponse(c, 200, data);
// })
export default api;