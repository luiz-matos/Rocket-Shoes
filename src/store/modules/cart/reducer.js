import { createSlice } from '@reduxjs/toolkit'

import { checkoutSuccess } from '../order/actions'

function findIndex(cart, id) {
  return cart.findIndex(product => product.id === id)
}

const cart = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCartSuccess(state, { payload: product }) {
      state.push(product)
    },
    removeFromCart(state, { payload: id }) {
      const index = findIndex(state, id)
      if (index >= 0) state.splice(index, 1)
    },
    updateAmountSuccess: {
      prepare: (id, amount) => ({ payload: { id, amount } }),
      reducer(state, { payload: { id, amount } }) {
        const index = findIndex(state, id)
        if (index >= 0) state[index].amount = Number(amount)
      },
    },
    decrementAmount(state, { payload: id }) {
      const index = findIndex(state, id)
      if (index >= 0 && state[index].amount > 1) state[index].amount -= 1
    },
  },
  extraReducers: builder => builder.addCase(checkoutSuccess, () => []),
})

export const cartActions = cart.actions

export default cart.reducer
