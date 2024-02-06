import { setLoggedIn, setLogout } from '../slices/userSlice';
import { loginUser, registerUser, getPersonalDetails, submitPersonalDetails } from '../api';

export const login = async (dispatch, inputBody) => {
    try {
        const result = await loginUser(inputBody);
        if (result.status === 'success') {
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            dispatch(setLoggedIn({ accessToken: result.accessToken, user: result.user }));
            return result;
        } else {
            return result;
        }
    } catch (error) {
        console.error('Login failed:', error);

    }


};

export const register = async (dispatch, inputBody) => {
    try {
        const result = await registerUser(inputBody);
        if (result.status === 'success') {
            return result;
        } else {
            return result;
        }
    } catch (error) {
        console.error('register failed:', error);

    }
};

export const logout = async (dispatch) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch(setLogout());
}

export const getPersonalInfo = async (dispatch) => {
    try {
        const result = await getPersonalDetails();
        return result.data;
    } catch (error) {

    }
}
export const submitPersonalInfo = async (formInput) => {
    try {
        const result = await submitPersonalDetails(formInput);
        return result.data;
    } catch (error) {

    }
}