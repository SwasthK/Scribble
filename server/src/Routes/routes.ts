import { Hono } from 'hono'

//Middleware Imports
import { authMiddleware } from '../Middleware/Auth'
import { getFileToUpload } from '../Middleware/cloudinary'
import { findActiveUser } from '../Middleware/findActiveUser'
import { DraftPostBodyParse, publishPostBodyParse, signupBodyParse, updateAvatarBodyParse } from '../Middleware/Body.Parse'

//Admin Routes - Imports
import { registerAdmin } from '../Controllers/Admin/register'
import { createCategory, deleteAllCategory, deleteCategory, getCategory, updateCategory } from '../Controllers/Admin/category'

// Auth Routes - Imports
import { logout, refreshAccessToken, signin, signup } from 'Controllers/Auth/auth.post'

// User Details Routes - Imports
import { updateUserAvatar, updateUserProfile } from 'Controllers/User/user.put'
import { getAllUsersName, getUserDetailsByUsername } from 'Controllers/User/user.get'

//Draft Post - Imports
import { getDraftedPostFullContentById, getDraftedPostShortned } from 'Controllers/Posts/Draft/draft.get'
import { deleteDraftBulk, deleteDraftPostById } from 'Controllers/Posts/Draft/draft.delete'
import { createNewDraftPost } from 'Controllers/Posts/Draft/draft.post'
import { updateDraftPostById } from 'Controllers/Posts/Draft/draft.put'

//Publish Post - Imports
import { createNewPublishPost } from 'Controllers/Posts/Publish/publish.post'
import { updatePublishById } from 'Controllers/Posts/Publish/publish.put'
import { deletePublishedPostById } from 'Controllers/Posts/Publish/publish.delete'

//Post Manipulation - Imports
import { getAllPosts, getAllPostsName, getMostLikedPosts, getPostByAuthorId, getPostByCategory, getPostBySlug, getPostByUsername, getUserPosts } from 'Controllers/Posts/Post/post.get'

//Save Post - Imports
import { getSavedPost } from 'Controllers/Posts/Save/save.get'
import { handleSavePost } from 'Controllers/Posts/Save/save.post'

//Archive Post - Imports
import { archivePost, unArchivePost } from 'Controllers/Posts/Archive/archive.post'
import { getArchivedPost } from 'Controllers/Posts/Archive/archive.get'

//Like Post - Imports
import { likeAndUnlikePost } from 'Controllers/Posts/Like/like.post'

//Social Post - Imports
import { updateUserSocials } from 'Controllers/Posts/Social/social.put'

//Follow Post - Imports
import { getFollowersDetails, getFollowingsDetails } from 'Controllers/Posts/Follow/follow.get'
import { UnFollowUser } from 'Controllers/Posts/Follow/follow.delete'
import { FollowUser } from 'Controllers/Posts/Follow/follow.post'

//Comment Post - Imports
import { addComments } from '../Controllers/Posts/Comment/comment.post'
import { getCommentsWithoutReply } from '../Controllers/Posts/Comment/comment.get'

//Post Report - Imports
import { reportPost } from 'Controllers/Posts/Report/report.post'

//Category - Imports
import { getAllCategory } from 'Controllers/Posts/Category/category.get'

const api = new Hono();

//Middleware
api.use('/blog/*', authMiddleware, findActiveUser)

api
    //Admin Specific
    .post('/register/admin/:id', authMiddleware, findActiveUser, registerAdmin)
    .post('/category/create', authMiddleware, findActiveUser, createCategory)
    .put('/category/update', authMiddleware, findActiveUser, updateCategory)
    .delete('/category/delete', authMiddleware, findActiveUser, deleteCategory)
    .delete('/category/deleteAll', authMiddleware, findActiveUser, deleteAllCategory)
    .get('/category/get', authMiddleware, findActiveUser, getCategory)

    //Auth Routes
    .post('/signup', signupBodyParse, getFileToUpload, signup)
    .post('/signin', signin)
    .post('/logout', authMiddleware, findActiveUser, logout)
    .post('/refreshAccessToken', refreshAccessToken)

    // User Manipulations Routes
    .put('/updateUserProfile', authMiddleware, findActiveUser, updateUserProfile)
    .put('/updateUserAvatar', authMiddleware, findActiveUser, updateAvatarBodyParse, updateUserAvatar)
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

    // Post Manipulations Routes
    .get('/posts/getall', authMiddleware, findActiveUser, getAllPosts)
    .get('/posts/getBy/authorId/:authorId', authMiddleware, findActiveUser, getPostByAuthorId)
    .get('/posts/getBy/username/:username', authMiddleware, findActiveUser, getPostByUsername)
    .get('/posts/getBy/slug/:postSlug', authMiddleware, findActiveUser, getPostBySlug)
    .get('posts/user', authMiddleware, findActiveUser, getUserPosts)
    .get('/posts/mostliked', authMiddleware, findActiveUser, getMostLikedPosts)
    .get('/posts/getBy/Category/:categoryName', authMiddleware, findActiveUser, getPostByCategory)
    .get('/posts/getAllPostsName', authMiddleware, findActiveUser, getAllPostsName)

    // Save & Unsave Post Routes
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

    //Comment Routes
    .post('/comment/add', authMiddleware, findActiveUser, addComments)
    .get('/comment/getNoReply/:postId', authMiddleware, findActiveUser, getCommentsWithoutReply)

    //Category Routes
    .get('/category/getall', authMiddleware, findActiveUser, getAllCategory)

    //Post Report Routes
    .post('/post/report/:postId', authMiddleware, findActiveUser, reportPost)

export default api;