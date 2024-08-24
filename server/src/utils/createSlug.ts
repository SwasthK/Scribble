export function createSlug(title: string, maxLength: number) {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug.length > maxLength
        ? slug.substring(0, 20) + '...'
        : slug;
}