import { Context, Hono } from 'hono'

//import Admin Routes handlers
import { registerAdmin } from '../Controllers/Admin/register'

//import Auth Routes handlers
import { verifyUser } from '../Controllers/Auth/Verify_User'
import { signup, signin, logout, refreshAccessToken } from '../Controllers/Auth/User_Controller'
import { updateUserProfile, updateUserAvatar } from '../Controllers/Auth/User_Update_Controller'
import { deleteUserProfile } from '../Controllers/Auth/User_Delete_Controller'
import { updateUserPassword } from '../Controllers/Auth/Password_Update_Controller'

//import Follow Route handlers
import { FollowUser, UnFollowUser } from '../Controllers/FollowUser/user.Follow.Controller'
import { getFollowersDetails, getFollowingsDetails } from '../Controllers/FollowUser/user.getFollow.Controller'

//Import Post Route handlers
import { createNewDraftPost } from 'Controllers/Posts/create.Post'
import { updateDraftPostById } from '../Controllers/Posts/update.Post'
import {
    getPostById,
    getPostByTitle,
    getAllPosts,
    getPublishedPost,

    getUserPosts,
    getPostBySlug,
    getPostByAuthorId,
    getDraftedPostShortned,
    getDraftedPostFullContentById
} from '../Controllers/Posts/get.Posts'
import { deleteDraftBulk, deleteDraftPostById, deletePublishedPostById } from '../Controllers/Posts/delete.Post'

//Import Category Route handlers
import { createCategory } from '../Controllers/Category/create.controller'
import { getAllCategory, getCategory } from '../Controllers/Category/getCategory.controller'
import { updateCategory } from '../Controllers/Category/update.controller'
import { deleteCategory } from '../Controllers/Category/delete.controller'

//Import Tag Route handlers
import { createTag } from '../Controllers/Tags/create.controller'
import { getAllTag, getTag } from '../Controllers/Tags/getTag.controller'
import { updateTag } from '../Controllers/Tags/update.controller'
import { deleteTag } from '../Controllers/Tags/delete.controller'

//Import Like Route handlers
import { likeAndUnlikePost } from '../Controllers/Like/like.Post'

// Import Publish Post handlers
import { createNewPublishPost, updatePublishById } from '../Controllers/Posts/publish.Post'

//Archive Post
import { archivePost, getArchivedPost, unArchivePost } from '../Controllers/Posts/Archive/archive.Post'

//Import Notification Route handlers
import {
    createUserNotifications,
    getUserNotifications,
    markNotificationAsRead
} from '../Controllers/Notification/user_Notification_Controller'

//Import comment Route handlers
import { removeComment } from '../Controllers/Comments/remove.Comment.Post'
import { addComments } from '../Controllers/Comments/add.Comment.Post'
import { getComments } from '../Controllers/Comments/get.Comment.Post'

//Import MiddlwWares
import { authMiddleware } from '../Middleware/Auth'
import { findActiveUser } from '../Middleware/findActiveUser'

import { dbConnect } from '../Connection/db.connect'
import { apiResponse } from '../utils/apiResponse'
import { apiError } from '../utils/apiError'
import { getFileToUpload } from '../Middleware/cloudinary'
import { DraftPostBodyParse, publishPostBodyParse, signupBodyParse, updateAvatarBodyParse } from '../Middleware/Body.Parse'
import { handleSavePost } from 'Controllers/Posts/Save/save.Post'
import { getSavedPost } from 'Controllers/Posts/Save/getSavedPost'
import { updateUserSocials } from 'Controllers/Socials/socials'

const api = new Hono();

//Middleware
api.use('/blog/*', authMiddleware, findActiveUser)

api
    //Admin Specific
    .post('/register/admin/:id', authMiddleware, findActiveUser, registerAdmin)

    //Auth Routes
    .get('/verifyUser', authMiddleware, findActiveUser, verifyUser)
    .post('/signup', signupBodyParse, getFileToUpload, signup)
    .post('/signin', signin)
    .post('/logout', authMiddleware, findActiveUser, logout)
    .post('/refreshAccessToken', refreshAccessToken)
    .put('/updateUserProfile', authMiddleware, findActiveUser, updateUserProfile)
    .put('/updateUserPassword', authMiddleware, findActiveUser, updateUserPassword)
    .put('/updateUserAvatar', authMiddleware, findActiveUser, updateAvatarBodyParse, updateUserAvatar)
    .delete('/deleteUserProfile', authMiddleware, findActiveUser, deleteUserProfile)

    // ---------------------------------------------------------------------

    // Draft Routes
    .get('/posts/drafts/shortened', authMiddleware, findActiveUser, getDraftedPostShortned)
    .get('/posts/drafts/fullContent/:postId', authMiddleware, findActiveUser, getDraftedPostFullContentById)
    .delete('/posts/delete/draftById/:draftId', authMiddleware, findActiveUser, deleteDraftPostById)
    .delete('/posts/delete/draftBulk', authMiddleware, findActiveUser, deleteDraftBulk)
    .post('/post/createNewDraftPost', authMiddleware, findActiveUser, DraftPostBodyParse, getFileToUpload, createNewDraftPost)
    .put('/posts/updateDraftById/:postId', authMiddleware, findActiveUser, DraftPostBodyParse, updateDraftPostById)

    // Publish Routes
    .post('/posts/createNewPublishPost', authMiddleware, findActiveUser, publishPostBodyParse, getFileToUpload, createNewPublishPost)
    .put('/posts/updatePublishById/:postId', authMiddleware, findActiveUser, publishPostBodyParse, updatePublishById)
    .delete('/posts/delete/publishById/:publishId', authMiddleware, findActiveUser, deletePublishedPostById)

    // Post Manipulations
    .get('/posts/getall', authMiddleware, findActiveUser, getAllPosts)
    .get('/posts/getBy/authorId/:authorId', authMiddleware, findActiveUser, getPostByAuthorId)
    .get('/posts/getBy/slug/:postSlug', authMiddleware, findActiveUser, getPostBySlug)

    // Save & Unsave Post
    .get("/posts/saved/getAll", authMiddleware, findActiveUser, getSavedPost)
    .post('/posts/save/:postId', authMiddleware, findActiveUser, handleSavePost)

    //Archive Post Routes
    .post('/post/archive/:postId', authMiddleware, findActiveUser, archivePost)
    .post('/post/unarchive/:postId', authMiddleware, findActiveUser, unArchivePost)
    .get('posts/archived/getAll', authMiddleware, findActiveUser, getArchivedPost)

    //Like Routes
    .post('/post/like/:postId', authMiddleware, findActiveUser, likeAndUnlikePost)

    //Social Routes
    .put('/user/socials/update', authMiddleware, findActiveUser, updateUserSocials)

    // --------------------------------------------------------------------------

    //Follow Routes
    .post('profile/:id/follow', authMiddleware, findActiveUser, FollowUser)
    .delete('profile/:id/unfollow', authMiddleware, findActiveUser, UnFollowUser)
    .get('/profile/getFollowersDetails', authMiddleware, findActiveUser, getFollowersDetails)
    .get('/profile/getFollowingsDetails', authMiddleware, findActiveUser, getFollowingsDetails)

    //Post Routes
    // .put('/post/updateDraftPost', authMiddleware, findActiveUser, updateDraftPost)
    .get('/posts/get/:postId', authMiddleware, findActiveUser, getPostById)

    .get('/posts/getBy/title/:postTitle', authMiddleware, findActiveUser, getPostByTitle)
    .get('posts/published', authMiddleware, findActiveUser, getPublishedPost)
    .get('posts/user', authMiddleware, findActiveUser, getUserPosts)

    // .post('/posts/upsert', authMiddleware, findActiveUser, upSertDraftPost)



    //Notification Routes
    .post('/notification/createUserNotifications', authMiddleware, findActiveUser, createUserNotifications)
    .get('/notification/getUserNotifications', authMiddleware, findActiveUser, getUserNotifications)
    .put('/notification/markNotificationAsRead/:id', authMiddleware, findActiveUser, markNotificationAsRead)

    //Category Routes
    .post('/category/create', authMiddleware, findActiveUser, createCategory)
    .put('/category/update', authMiddleware, findActiveUser, updateCategory)
    .delete('/category/delete', authMiddleware, findActiveUser, deleteCategory)
    .get('/category/getall', authMiddleware, findActiveUser, getAllCategory)
    .get('/category/get', authMiddleware, findActiveUser, getCategory)

    //Tag Routes
    .post('/tag/create', authMiddleware, findActiveUser, createTag)
    .put('/tag/update', authMiddleware, findActiveUser, updateTag)
    .delete('/tag/delete', authMiddleware, findActiveUser, deleteTag)
    .get('/tag/getall', authMiddleware, findActiveUser, getAllTag)
    .get('/tag/get', authMiddleware, findActiveUser, getTag)






    //Comment Routes
    .post('/comment/add', authMiddleware, findActiveUser, addComments)
    .delete('/comment/remove', authMiddleware, findActiveUser, removeComment)
    .get('/comment/get/:postId', authMiddleware, findActiveUser, getComments)


    //Followers
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
        console.log('All Details--------------------');

        const prisma = c.get('prisma');

        try {
            const userWithDetails = await prisma.post.findMany({
                where: {
                    author: {
                        username: 'AlphaWolf'
                    }
                },
                include: {
                    author: true
                }

            }


            );

            if (!userWithDetails) {
                return apiError(c, 404, "User not found");
            }

            // const formattedData = userWithDetails.map((user: any) => ({
            //     username: user.username,
            //     followers: user.followers.map((f: any) => f.following.username),
            //     following: user.following.map((f: any) => f.follower.username)
            // }));

            return apiResponse(c, 200, userWithDetails, "User details fetched successfully");



        } catch (error: any) {
            console.log('Fetch User Details Error:', error.message);
            return apiError(c, 500, "Internal Server Error", { code: "CE" });
        }
    })

    .post('/upload', getFileToUpload, async (c: Context) => {
        const upload = c.get('fileUploadResponse')
        return apiResponse(c, 200, upload);
    })

    .delete('/delete', async (c: Context) => {
        const prisma: any = await dbConnect(c);
        const data = await prisma.user.deleteMany({
        });
        return apiResponse(c, 200, data);
    })

export default api;