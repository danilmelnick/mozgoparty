export function userDataSuccess(data) {
    return {
        type : 'USER_INFO_SUCCESS',
        payload : data
    }
}


export default function userDataAction(token) {
    console.log('TESssT  >>>>>>> ' + token)
    return ( dispatch ) => {
        fetch('https://api.party.mozgo.com/api/users/me', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        .then( res => res.json() )
        .then( data => dispatch( userDataSuccess(data) ) )
        .catch( e => console.log( 'Error' + e ) )
    }
}
