// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const accessToken = localStorage.getItem('accessToken');
const initialState = {
    authenticated: user && accessToken ? true : false,
    accessToken: accessToken,
    user:accessToken || {}, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.authenticated = true;
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        setLogout: (state) => {
            state.authenticated = false;
            state.accessToken = null;
            state.user = {};
        },
    },
});

export const { setLoggedIn, setToken, setLogout, addAddress, setPersonalInfo } = userSlice.actions;
export const userState = (state) => state;
export default userSlice.reducer;
