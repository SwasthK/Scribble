import { atom } from "recoil";

export const postsAtom = atom<string[]>({
    key: 'postAtom',
    default: []
})

export const allUsersNames = atom<string[]>({
    key: 'allUsersNames',
    default: []
})
    