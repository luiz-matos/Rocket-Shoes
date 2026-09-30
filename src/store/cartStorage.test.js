import { beforeEach, describe, expect, it } from 'vitest'

import { loadCart, saveCart } from './cartStorage'

const product = { id: 1, title: 'Tênis', price: 100, amount: 2 }

beforeEach(() => localStorage.clear())

describe('carrinho salvo no navegador', () => {
  it('devolve o carrinho salvo', () => {
    saveCart([product])

    expect(loadCart()).toEqual([product])
  })

  it.each([
    ['nada salvo', null],
    ['JSON inválido', '{quebrado'],
    ['valor que não é lista', '{"id":1}'],
  ])('começa vazio com %s', (_, value) => {
    if (value !== null) localStorage.setItem('@RocketShoes:cart', value)

    expect(loadCart()).toEqual([])
  })
})
