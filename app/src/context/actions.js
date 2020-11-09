import { Api } from "../data";

export async function loginUser(dispatch, username, password) {
    try {
        dispatch({ type: 'REQUEST_LOGIN' });

        let response = await Api.Login(username, password);

        if (response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            dispatch({ type: 'LOGIN_SUCCESS', payload: {
                    user: response.data.data
                }
            });
            return response.data.data;
        }
    
        dispatch({ type: 'LOGIN_ERROR', error: response.message });
        return;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: "Invalid credentials" });
    }
}

export async function logoutUser(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
}