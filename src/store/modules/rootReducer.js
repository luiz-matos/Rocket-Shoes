import { combineReducers } from '@reduxjs/toolkit'

import cart from './cart/reducer'

const rootReducer = combineReducers({
  cart,
})

export default rootReducer
