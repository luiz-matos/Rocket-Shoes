import { createSelector } from '@reduxjs/toolkit'

import { formatPrice } from '../../../util/format'

const selectCart = state => state.cart

export const selectCartSize = state => selectCart(state).length

export const selectAmountById = createSelector(selectCart, cart =>
  Object.fromEntries(cart.map(product => [product.id, product.amount]))
)

export const selectCartItems = createSelector(selectCart, cart =>
  cart.map(product => ({
    ...product,
    priceFormatted: formatPrice(product.price),
    subtotal: formatPrice(product.price * product.amount),
  }))
)

export const selectCartTotal = createSelector(selectCart, cart =>
  formatPrice(
    cart.reduce((total, product) => total + product.price * product.amount, 0)
  )
)
