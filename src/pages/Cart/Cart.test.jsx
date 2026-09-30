import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from 'redux'

import rootReducer from '../../store/modules/rootReducer'
import Cart from '.'

function renderCart(cart) {
  const store = createStore(rootReducer, { cart })
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>
  )
  return store
}

const product = {
  id: 1,
  title: 'Tênis',
  price: 179.9,
  priceFormatted: 'R$ 179,90',
  image: 'tenis.jpg',
  amount: 2,
}

describe('carrinho', () => {
  it('mostra o subtotal e o total dos produtos', () => {
    renderCart([product])

    expect(screen.getByText('Tênis')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 359,80')).toHaveLength(2)
  })

  it('avisa quando está vazio e leva de volta à vitrine', () => {
    renderCart([])

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver os produtos' })).toHaveAttribute('href', '/')
    expect(screen.queryByText('Finalizar pedido')).not.toBeInTheDocument()
  })
})
