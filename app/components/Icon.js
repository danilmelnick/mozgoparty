import React from 'react'
import {Image, TouchableOpacity} from 'react-native'

export const Icon = ({src, press, h, w}) => {
    return (
        <TouchableOpacity
            onPress={() => press()}
        >
            <Image
                source={`${src}`}
                style={{width : w, height : h}}
            />
        </TouchableOpacity>
    )
    

}

export default Icon