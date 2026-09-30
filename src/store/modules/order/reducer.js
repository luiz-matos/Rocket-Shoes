import { createReducer } from '@reduxjs/toolkit'

import { cartActions } from '../cart/reducer'
import { checkoutFailure, checkoutRequest, checkoutSuccess } from './actions'

const initialState = { sending: false, lastOrderId: null }

export default createReducer(initialState, builder =>
  builder
    .addCase(checkoutRequest, state => {
      state.sending = true
    })
    .addCase(checkoutSuccess, (state, { payload: orderId }) => {
      state.sending = false
      state.lastOrderId = orderId
    })
    .addCase(checkoutFailure, state => {
      state.sending = false
    })
    // Um produto novo no carrinho começa outra compra: a confirmação do
    // pedido anterior sai da tela.
    .addCase(cartActions.addToCartSuccess, state => {
      state.lastOrderId = null
    })
)
