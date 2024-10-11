import { atom } from "recoil";
import { blogType } from "./atoms.types";

export const blogState = atom<blogType>({
    key: "blogState",
    default: {
        author: "",
        title: "",
        content: "",
        createdAt: "",
        id: "",
        slug: "",
        tags: [],
    },
});