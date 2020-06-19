import { combineReducers } from 'redux'
import { userData } from '../reducers/userData'

const rootReducers = combineReducers({
    userData,
})

export default rootReducers

