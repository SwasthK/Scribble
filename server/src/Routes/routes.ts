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
import {

    getUserPosts,
    getPostBySlug,
    getMostLikedPosts,
    getPostByCategory,
    getAllPostsName
} from '../Controllers/Posts/get.Posts'


//Import Category Route handlers
import { createCategory } from '../Controllers/Category/create.controller'
import { getAllCategory, getCategory } from '../Controllers/Category/getCategory.controller'
import { updateCategory } from '../Controllers/Category/update.controller'
import { deleteAllCategory, deleteCategory } from '../Controllers/Category/delete.controller'

//Import Like Route handlers
import { likeAndUnlikePost } from '../Controllers/Like/like.Post'

//Archive Post
import { archivePost, getArchivedPost, unArchivePost } from '../Controllers/Posts/Archive/archive.Post'

//Import comment Route handlers
import { addComments } from '../Controllers/Comments/add.Comment.Post'
import { getCommentsWithoutReply } from '../Controllers/Comments/get.Comment.Post'

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
import { reportPost } from 'Controllers/Report'
import { getAllUsersName, getUserDetailsByUsername } from 'Controllers/User/user.get'

//Draft Post - Imports
import { getDraftedPostFullContentById, getDraftedPostShortned } from 'Controllers/Postss/Draft/draft.get'
import { deleteDraftBulk, deleteDraftPostById } from 'Controllers/Postss/Draft/draft.delete'
import { createNewDraftPost } from 'Controllers/Postss/Draft/draft.post'
import { updateDraftPostById } from 'Controllers/Postss/Draft/draft.put'

//Publish Post - Imports
import { createNewPublishPost } from 'Controllers/Postss/Publish/publish.post'
import { updatePublishById } from 'Controllers/Postss/Publish/publish.put'
import { deletePublishedPostById } from 'Controllers/Postss/Publish/publish.delete'

//Post Manipulation - Imports
import { getAllPosts, getPostByAuthorId, getPostByUsername } from 'Controllers/Postss/Post/post.get'

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

    // User Details Routes
    .get('/user/getBy/username/:username', authMiddleware, findActiveUser, getUserDetailsByUsername)
    .get('/user/getAllUsersName', authMiddleware, findActiveUser, getAllUsersName)

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
    .get('/posts/getBy/username/:username', authMiddleware, findActiveUser, getPostByUsername)
    // --Yet to implement
    .get('/posts/getBy/slug/:postSlug', authMiddleware, findActiveUser, getPostBySlug)
    .get('posts/user', authMiddleware, findActiveUser, getUserPosts)
    .get('/posts/mostliked', authMiddleware, findActiveUser, getMostLikedPosts)
    .get('/posts/getBy/Category/:categoryName', authMiddleware, findActiveUser, getPostByCategory)
    .get('/posts/getAllPostsName', authMiddleware, findActiveUser, getAllPostsName)

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

    //Follow Routes
    .post('/user/profile/:id/follow', authMiddleware, findActiveUser, FollowUser)
    .delete('/user/profile/:id/unfollow', authMiddleware, findActiveUser, UnFollowUser)
    .get('/profile/getFollowersDetails', authMiddleware, findActiveUser, getFollowersDetails)
    .get('/profile/getFollowingsDetails', authMiddleware, findActiveUser, getFollowingsDetails)

    //Post Report Routes
    .post('/post/report/:postId', authMiddleware, findActiveUser, reportPost)

    //Comment Routes
    .post('/comment/add', authMiddleware, findActiveUser, addComments)
    .get('/comment/getNoReply/:postId', authMiddleware, findActiveUser, getCommentsWithoutReply)

    //Category Routes
    .get('/category/getall', authMiddleware, findActiveUser, getAllCategory)


    // --------------------------------------------------------------------------



    // ADMIN_USAGE - > Category Routes
    .post('/category/create', authMiddleware, findActiveUser, createCategory)
    .put('/category/update', authMiddleware, findActiveUser, updateCategory)
    .delete('/category/delete', authMiddleware, findActiveUser, deleteCategory)
    .get('/category/get', authMiddleware, findActiveUser, getCategory)
    .delete('/category/deleteAll', authMiddleware, findActiveUser, deleteAllCategory)

    //all data
    .get('/alldetails', async (c: Context) => {
        console.log('All Details--------------------');

        const prisma = c.get('prisma');

        try {
            const userWithDetails = await prisma.post.findMany({
                where: {
                    status: 'PUBLISHED'
                    // author: {
                    //     username: 'AlphaWolf'
                    // }
                },
                // include: {
                //     author: true
                // },
                select: {
                    id: true,
                    author: {
                        select: {
                            username: true,
                            password: true
                        }
                    }
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

    .delete('/delete', async (c: Context) => {
        const prisma: any = await dbConnect(c);
        const data = await prisma.user.deleteMany({
        });
        return apiResponse(c, 200, data);
    })

export default api;