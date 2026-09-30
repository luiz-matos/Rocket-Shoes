import { describe, expect, it } from 'vitest'

import cart from './reducer'
import {
  addToCartSuccess,
  decrementAmount,
  removeFromCart,
  updateAmountSuccess,
} from './actions'
import { checkoutSuccess } from '../order/actions'

const product = { id: 1, title: 'Tênis', price: 100, amount: 1 }

describe('reducer do carrinho', () => {
  it('adiciona o produto', () => {
    expect(cart([], addToCartSuccess(product))).toEqual([product])
  })

  it('remove o produto pelo id', () => {
    expect(cart([product], removeFromCart(1))).toEqual([])
  })

  it('altera a quantidade do produto', () => {
    expect(cart([product], updateAmountSuccess(1, 3))).toEqual([
      { ...product, amount: 3 },
    ])
  })

  it('diminui a quantidade sem passar de 1', () => {
    const two = { ...product, amount: 2 }

    expect(cart([two], decrementAmount(1))).toEqual([product])
    expect(cart([product], decrementAmount(1))).toEqual([product])
  })

  it('esvazia o carrinho ao finalizar o pedido', () => {
    expect(cart([product], checkoutSuccess(7))).toEqual([])
  })

  it('ignora id que não está no carrinho', () => {
    expect(cart([product], removeFromCart(9))).toEqual([product])
    expect(cart([product], updateAmountSuccess(9, 3))).toEqual([product])
  })
})
