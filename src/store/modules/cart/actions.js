import { createAction } from '@reduxjs/toolkit'

import { cartActions } from './reducer'

export const {
  addToCartSuccess,
  removeFromCart,
  updateAmountSuccess,
  decrementAmount,
} = cartActions

// Pedido atendido pelos sagas: consulta o estoque antes de somar 1 unidade.
export const addToCartRequest = createAction('cart/addToCartRequest')
