import { atom } from "recoil"
import { followAtomType } from "./atoms.types"

export const followAtom = atom<followAtomType>({
    key: 'followAtom',
    default: {
        following: []
    }
})