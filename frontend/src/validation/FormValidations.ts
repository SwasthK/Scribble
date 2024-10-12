export const validateTitle = (username: string) => {
    if (!username) return "Title is required";
    if (username.length < 6) return "Title must be at least 6 characters long";
    if (username.length > 25)
        return "Title must be at most 25 characters long";
    return "";
};

export const validateShortCaption = (username: string) => {
    if (!username) return "Short Caption is required";
    if (username.length < 6) return "Short Caption must be at least 10 characters long";
    if (username.length > 100)
        return "Short Caption must be at most 100 characters long";
    return "";
};
