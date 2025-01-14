export const validateTitle = (value: string) => {
    if (!value) return "Title is required";
    if (value.length < 6) return "Title must be at least 6 characters long";
    if (value.length > 40)
        return "Title must be at most 40 characters long";
    return "";
};

export const validateShortCaption = (value: string) => {
    if (!value) return "Short Caption is required";
    if (value.length < 10) return "Short Caption must be at least 10 characters long";
    if (value.length > 120)
        return "Short Caption must be at most 120 characters long";
    return "";
};

export const validateBlogBody = (value: string) => {
    if (!value) return "Content is required";
    if (value.length < 250) return "Your Content Seems to be Small, Write More !";
    if (value.length > 10000)
        return "You have Reached Your Content Limit";
    return "";
};