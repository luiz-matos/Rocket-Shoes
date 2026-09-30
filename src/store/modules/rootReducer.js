import { combineReducers } from '@reduxjs/toolkit'

import cart from './cart/reducer'
import order from './order/reducer'

const rootReducer = combineReducers({
  cart,
  order,
})

export default rootReducer
