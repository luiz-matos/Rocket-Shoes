import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createStore } from 'redux'

import rootReducer from '../../store/modules/rootReducer'
import Cart from '.'

vi.mock('react-toastify', () => ({ toast: { success: vi.fn() } }))

function renderCart(cart) {
  const store = createStore(rootReducer, { cart })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route path="/" element={<p>Vitrine</p>} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
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

  it('finaliza o pedido, esvazia o carrinho e volta para a vitrine', () => {
    const store = renderCart([product])

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }))

    expect(store.getState().cart).toEqual([])
    expect(toast.success).toHaveBeenCalledWith('Pedido finalizado!')
    expect(screen.getByText('Vitrine')).toBeInTheDocument()
  })

  it('avisa quando está vazio e leva de volta à vitrine', () => {
    renderCart([])

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ver os produtos' })
    ).toHaveAttribute('href', '/')
    expect(screen.queryByText('Finalizar pedido')).not.toBeInTheDocument()
  })
})
