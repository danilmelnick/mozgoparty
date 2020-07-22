let userState = {
  loading: false,
  userInfo: {
    name: "",
    email: ""
  }
};

export function userData(state = userState, action) {
  switch (action.type) {
    case "USER_INFO_SUCCESS":
      return {
        ...state,
        userInfo: action.payload,
        loading: true
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        userInfo: {
          name: "",
          email: ""
        },
        loading: true
      };

    default:
      return state;
  }
}
