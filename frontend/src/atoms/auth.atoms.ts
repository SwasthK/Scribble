import { atom, useSetRecoilState } from 'recoil';
import { authAtomType } from './atoms.types';

export const authAtom = atom<authAtomType>({
    key: 'authAtom',
    default: {
        user: {},
        isAuthenticated: false,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    }
})

// export const useAuthAtomCreateValue = () => {
//     const setAuthAtomValue = useSetRecoilState(authAtom)
//     return () => {
//         localStorage.createItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         setAuthAtomValue((prev) => ({
//             ...prev,
//             user: {},
//             accessToken: localStorage.getItem("accessToken") || null,
//             refreshToken: localStorage.getItem("refreshTtoken") || null,
//         }));
//     }
// }

export const useAuthAtomResetValue = () => {
    const setAuthAtom = useSetRecoilState(authAtom)
    return () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthAtom({
            user: {},
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null
        })
    }
}