import { atom } from "recoil";

export const postsAtom = atom<string[]>({
    key: 'postAtom',
    default: []
})

export const allCategoryAtom = atom<string[]>({
    key: 'allCategoryAtom',
    default: []
})
