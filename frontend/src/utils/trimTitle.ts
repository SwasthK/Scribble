export const trimTitle = (title: string, max: number) => {
    return title.length > max ? title.substring(0, max) + " ..." : title
}