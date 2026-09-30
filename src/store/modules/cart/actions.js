import { createAction } from '@reduxjs/toolkit'

import { cartActions } from './reducer'

export const {
  addToCartSuccess,
  removeFromCart,
  updateAmountSuccess,
  checkout,
} = cartActions

// Pedidos atendidos pelos sagas: consultam o estoque antes de mudar o carrinho.
export const addToCartRequest = createAction('cart/addToCartRequest')

export const updateAmountRequest = createAction(
  'cart/updateAmountRequest',
  (id, amount) => ({ payload: { id, amount } })
)
