import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
} from './actions';

const reducer = (state, action) => {
  switch (action.type) {
    case DISPLAY_ALERT:
      return {
        ...state,
        showAlert: true,
        alertType: 'danger',
        alertText: 'Please provide all values!',
      };
    case CLEAR_ALERT:
      return {
        ...state,
        showAlert: false,
        alertType: '',
        alertText: '',
      };
    // case REGISTER_USER_BEGIN:
    //   return { ...state, isLoading: true };
    // case REGISTER_USER_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     token: action.payload.token,
    //     user: action.payload.user,
    //     userLocation: action.payload.location,
    //     jobLocation: action.payload.location,
    //     showAlert: true,
    //     alertType: 'success',
    //     alertText: 'User Created! Redirecting...',
    //   };
    // case REGISTER_USER_ERROR:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     showAlert: true,
    //     alertType: 'danger',
    //     alertText: action.payload.msg,
    //   };
    // case LOGIN_USER_BEGIN:
    //   return {
    //     ...state,
    //     isLoading: true,
    //   };
    // case LOGIN_USER_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     token: action.payload.token,
    //     user: action.payload.user,
    //     userLocation: action.payload.location,
    //     jobLocation: action.payload.location,
    //     showAlert: true,
    //     alertType: 'success',
    //     alertText: 'Login Successful! Redirecting...',
    //   };
    // case LOGIN_USER_ERROR:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     showAlert: true,
    //     alertType: 'danger',
    //     alertText: action.payload.msg,
    //   };
    case SETUP_USER_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case SETUP_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        userLocation: action.payload.location,
        jobLocation: action.payload.location,
        showAlert: true,
        alertType: 'success',
        alertText: action.payload.alertText,
      };
    case SETUP_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'danger',
        alertText: action.payload.msg,
      };
    default:
      throw new Error(`no such action : ${action.type}`);
  }
};

// const initialState = {
//   isLoading: false,
//   showAlert: false,
//   alertText: '',
//   alertType: '',
//   user: null,
//   token: null,
//   userLocation: '',
//   jobLocation: '',
// };
export default reducer;
