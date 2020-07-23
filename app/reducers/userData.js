let userState = {
  loading: false,
  userInfo: {
    name: "",
    email: ""
  }
};

export function userData(state = userState, action) {
  switch (action.type) {
    case "SET_DOWNLOAD_SUCCESS":
      return {
        ...state,
        download: action.payload
      };
    case "SET_GAME_TO_LOCAL_STORE":
      return {
        ...state,
        game: action.payload
      };
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
