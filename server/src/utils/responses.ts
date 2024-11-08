export enum GlobalResponse {
    // SUCCESS = "Success",
    // FAIL = "Fail",
    // ERROR = "Error",
    // INVALID = "Invalid",
    // UNAUTHORIZED = "Unauthorized",
    // NOTFOUND = "Not Found",
    // FORBIDDEN = "Forbidden",
    // BADREQUEST = "Bad Request",
    // CONFLICT = "Conflict",
    // UNAVAILABLE = "Service Unavailable",
    INTERNALERROR = "Internal Server Error",
}

export enum savePostResponse {
    NOSAVEDPOST = "No post saved",
    FETCHSUCCESS = "Fetch post successfully",
    SAVED = "Post saved successfully",
    UNSAVED = "Post unsaved successfully",
    NOCHANGE = "No change required",
    NOPOST = "Post not found",
    OWNPOST = "You can't save your own post",
    POSTID = "Post Id is required",
    INVALIDBODY = "Invalid request body",
    POSTNOTPUBLISHED = "Post is not published",
    ERRORLOG = "Handle Post Save Error : "
}
