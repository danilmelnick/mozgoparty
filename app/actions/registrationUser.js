export function registrationSuccess(data) {
    alert('RegistrSuccess' + JSON.stringify(data))
    return {
        type : 'REGISTRATION_SUCCESS',
        payload : data
    }
}


export default function registrationUser(name, email, password, password_confirmation, phone) {
    return ( dispatch ) => {
        fetch('https://api.base.mozgo.com/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify({
                'name' : name, 
                'email' : email, 
                'password' : password, 
                'password_confirmation' : password_confirmation, 
                'phone' : phone
            })
        })
        .then(res => {
            if(res.status !== 200) {
                alert(res.statusText)
            }
            return res
        })
        .then( res => res.json() )
        .then( data => dispatch( registrationSuccess(data) ) )
        .catch( e => console.log( 'Error' + e ) )
    }
}
