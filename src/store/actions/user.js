import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as path from '../../constants/api/urls';
import Cookies from 'js-cookie';

/**********************************************************
 ********************** Register user **********************
 **********************************************************/
export const registerUser = (formData) => {
  return async (dispatch) => {
    dispatch(registerUserStart());
    try {
      const response = await axios.post(path.REGISTER_USER, formData);
      Cookies.set('ls_user_jwt', response.data.token);
      Cookies.set('ls_last_auth_information', {
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        username: response.data.user.username,
        email: response.data.user.email,
      });
      dispatch(registerUserSuccess(response.data));
      dispatch(checkTokenTimeout());
    } catch (error) {
      dispatch(registerUserFail(error.response.data.error));
    }
  };
};

const registerUserStart = () => {
  return {
    type: actionTypes.REGISTER_USER_START,
  };
};

const registerUserSuccess = (formData) => {
  return {
    type: actionTypes.REGISTER_USER_SUCCESS,
    formData,
  };
};

const registerUserFail = (error) => {
  return {
    type: actionTypes.REGISTER_USER_FAIL,
    error,
  };
};

/**********************************************************
 ********************** Login user *************************
 **********************************************************/
export const loginUser = (formData) => {
  return async (dispatch) => {
    dispatch(loginUserStart());
    try {
      const response = await axios.post(path.LOGIN_USER, formData);
      if (formData.expiration) {
        Cookies.set('ls_user_jwt', response.data.token, { expires: 2 });
        Cookies.set(
          'ls_last_auth_information',
          {
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            username: response.data.user.username,
            email: response.data.user.email,
          },
          { expires: 2 }
        );
      } else {
        Cookies.set('ls_user_jwt', response.data.token);
        Cookies.set('ls_last_auth_information', {
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          username: response.data.user.username,
          email: response.data.user.email,
        });
      }
      dispatch(loginUserSuccess(response.data));
      dispatch(checkTokenTimeout());
    } catch (error) {
      dispatch(loginUserFail(error.response.data.error));
    }
  };
};

const loginUserStart = () => {
  return {
    type: actionTypes.LOGIN_USER_START,
  };
};

const loginUserSuccess = (formData) => {
  return {
    type: actionTypes.LOGIN_USER_SUCCESS,
    formData,
  };
};

const loginUserFail = (error) => {
  return {
    type: actionTypes.LOGIN_USER_FAIL,
    error,
  };
};

/**********************************************************
 ******************** Password reset **********************
 **********************************************************/
export const passwordReset = (email) => {
  return async (dispatch) => {
    dispatch(passwordResetStart());
    try {
      await axios.post(path.PASSWORD_RESET, email);
      dispatch(passwordResetSuccess());
    } catch (error) {
      dispatch(passwordResetFail(error.response.data.error));
    }
  };
};

const passwordResetStart = () => {
  return {
    type: actionTypes.PASSWORD_RESET_START,
  };
};

const passwordResetSuccess = () => {
  return {
    type: actionTypes.PASSWORD_RESET_SUCCESS,
  };
};

const passwordResetFail = (error) => {
  return {
    type: actionTypes.PASSWORD_RESET_FAIL,
    error,
  };
};

/**********************************************************
 ********************** Fetch user *************************
 **********************************************************/
export const fetchUser = () => {
  return async (dispatch) => {
    dispatch(fetchUserStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      const response = await axios.get(path.FETCH_USER, {
        headers: { Authorization: token },
      });
      Cookies.set('ls_last_auth_information', {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        username: response.data.username,
        email: response.data.email,
      });
      dispatch(fetchUserSuccess(response.data));
    } catch (error) {
      Cookies.remove('ls_user_jwt');
      Cookies.remove('ls_last_auth_information');
      dispatch(fetchUserFail(error));
    }
  };
};

const fetchUserStart = () => {
  return {
    type: actionTypes.FETCH_USER_START,
  };
};

const fetchUserSuccess = (userData) => {
  return {
    type: actionTypes.FETCH_USER_SUCCESS,
    userData,
  };
};

const fetchUserFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_FAIL,
    error,
  };
};

/**********************************************************
 ******************* Fetch user by id**********************
 **********************************************************/
export const fetchUserById = (userId) => {
  return async (dispatch) => {
    dispatch(fetchUserByIdStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      const response = await axios.get(`${path.FETCH_USER_BY_ID}/${userId}`, {
        headers: { Authorization: token },
      });
      dispatch(fetchUserByIdSuccess(response.data));
    } catch (error) {
      dispatch(fetchUserByIdFail(error));
    }
  };
};

const fetchUserByIdStart = () => {
  return {
    type: actionTypes.FETCH_USER_BY_ID_START,
  };
};

const fetchUserByIdSuccess = (userData) => {
  return {
    type: actionTypes.FETCH_USER_BY_ID_SUCCESS,
    userData,
  };
};

const fetchUserByIdFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_BY_ID_FAIL,
    error,
  };
};

/**********************************************************
 ********************** Logout user ************************
 **********************************************************/
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(logoutUserStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      await axios.post(
        path.LOGOUT_USER,
        {},
        {
          headers: { Authorization: token },
        }
      );
      Cookies.remove('ls_user_jwt');
      Cookies.remove('ls_last_auth_information');
      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(logoutUserFail(error.response.data));
    }
  };
};

const logoutUserStart = () => {
  return {
    type: actionTypes.LOGOUT_USER_START,
  };
};

const logoutUserSuccess = () => {
  return {
    type: actionTypes.LOGOUT_USER_SUCCESS,
  };
};

const logoutUserFail = (error) => {
  return {
    type: actionTypes.LOGOUT_USER_FAIL,
    error,
  };
};

/**********************************************************
 ***************** Logout user all *************************
 **********************************************************/
export const logoutUserAll = () => {
  return async (dispatch) => {
    dispatch(logoutUserAllStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      await axios.post(
        path.LOGOUT_USER_ALL,
        {},
        {
          headers: { Authorization: token },
        }
      );
      Cookies.remove('ls_user_jwt');
      Cookies.remove('ls_last_auth_information');
      dispatch(logoutUserAllSuccess());
    } catch (error) {
      dispatch(logoutUserAllFail(error.response.data));
    }
  };
};

const logoutUserAllStart = () => {
  return {
    type: actionTypes.LOGOUT_USER_ALL_START,
  };
};

const logoutUserAllSuccess = () => {
  return {
    type: actionTypes.LOGOUT_USER_ALL_SUCCESS,
  };
};

const logoutUserAllFail = (error) => {
  return {
    type: actionTypes.LOGOUT_USER_ALL_FAIL,
    error,
  };
};

/**********************************************************
 ********************** Auto logout ************************
 **********************************************************/
const checkTokenTimeout = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logoutUser());
    }, 3600 * 1000);
  };
};

/**********************************************************
 ********************** Update user ************************
 **********************************************************/
export const updateUserProfile = (formData) => {
  return async (dispatch) => {
    dispatch(updateUserProfileStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      const response = await axios.patch(path.UPDATE_USER, formData, {
        headers: { Authorization: token },
      });
      dispatch(updateUserProfileSuccess(response.data));
    } catch (error) {
      dispatch(updateUserProfileFail(error));
    }
  };
};

const updateUserProfileStart = () => {
  return {
    type: actionTypes.UPDATE_USER_PROFILE_START,
  };
};

const updateUserProfileSuccess = (updatedProfile) => {
  return {
    type: actionTypes.UPDATE_USER_PROFILE_SUCCESS,
    updatedProfile,
  };
};

const updateUserProfileFail = (error) => {
  return {
    type: actionTypes.UPDATE_USER_PROFILE_FAIL,
    error,
  };
};

/**********************************************************
 ***************** Update user password *******************
 **********************************************************/
export const updateUserPassword = (formData) => {
  return async (dispatch) => {
    dispatch(updateUserPasswordStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      await axios.patch(path.UPDATE_USER_PASSWORD, formData, {
        headers: { Authorization: token },
      });
      dispatch(updateUserPasswordSuccess());
      dispatch(logoutUserAll());
    } catch (error) {
      dispatch(updateUserPasswordFail(error.response.data.error));
    }
  };
};

const updateUserPasswordStart = () => {
  return {
    type: actionTypes.UPDATE_USER_PASSWORD_START,
  };
};

const updateUserPasswordSuccess = () => {
  return {
    type: actionTypes.UPDATE_USER_PASSWORD_SUCCESS,
  };
};

const updateUserPasswordFail = (error) => {
  return {
    type: actionTypes.UPDATE_USER_PASSWORD_FAIL,
    error,
  };
};

/***********************************************************
 ********************** Delete user ************************
 **********************************************************/
export const deleteUser = () => {
  return async (dispatch) => {
    dispatch(deleteUserStart());
    try {
      const token = Cookies.get('ls_user_jwt');
      await axios.delete(path.DELETE_USER, {
        headers: { Authorization: token },
      });
      Cookies.remove('ls_user_jwt');
      Cookies.remove('ls_last_auth_information');
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFail(error.response.data.error));
    }
  };
};

const deleteUserStart = () => {
  return {
    type: actionTypes.DELETE_USER_START,
  };
};

const deleteUserSuccess = () => {
  return {
    type: actionTypes.DELETE_USER_SUCCESS,
  };
};

const deleteUserFail = (error) => {
  return {
    type: actionTypes.DELETE_USER_FAIL,
    error,
  };
};

/**********************************************************
 ******************* User Error reset *********************
 **********************************************************/
export const resetUserError = () => {
  return {
    type: actionTypes.RESET_USER_ERROR,
  };
};
