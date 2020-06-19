import React from 'react'
import {Image, TouchableOpacity} from 'react-native'

export const Icon = ({src, press}) => {
    return (
        <TouchableOpacity
            onPress={() => press()}
        >
            <Image
                source={`${src}`}
                style={{width : 22, height : 19}}
            />
        </TouchableOpacity>
    )
    

}

export default Icon