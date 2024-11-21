import { atom } from "recoil";

export const postsAtom = atom<string[]>({
    key: 'postAtom',
    default: []
})
