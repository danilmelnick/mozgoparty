let userState = {
    loading : false,
}

export function userData(state = userState, action) {
    switch (action.type) {

    case 'USER_INFO_SUCCESS' :
        return { 
            ...state, 
            userInfo: action.payload,
            loading : true
        }

    default:
        return state;
    }
}
