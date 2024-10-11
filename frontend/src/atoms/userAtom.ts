import { atom, useSetRecoilState } from 'recoil';
import { UserStateType } from './atoms.types';

export const userState = atom<UserStateType>({
    key: 'userState',
    default: {
        id: '',
        avatarUrl: '',
        bio: '',
        username: '',
        email: '',
        token: localStorage.getItem('token') || null,
        isAuthenticated: false,
        createdAt: ''
    }
})

export const useResetUserState = () => {
    const setUserState = useSetRecoilState(userState)
    return () => {
        setUserState({
            id: '',
            avatarUrl: '',
            bio: '',
            username: '',
            email: '',
            token: null,
            isAuthenticated: false,
            createdAt: ''
        })
    }
}