import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import api from '../../services/api'
import { createAppStore } from '../../store/createAppStore'
import Cart from '.'

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))
vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))

// Estoque de 10 unidades, respondendo depois de 10 ms.
api.get.mockImplementation(
  () =>
    new Promise(resolve =>
      setTimeout(() => resolve({ data: { id: 1, amount: 10 } }), 10)
    )
)

function renderCart(cart) {
  const store = createAppStore(cart)
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

  it('grava o pedido e mostra a confirmação com o número', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 7 } })
    const store = renderCart([product])

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }), {
      detail: 1,
    })

    expect(
      screen.getByRole('button', { name: 'Enviando pedido...' })
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Aumentar' })).toBeDisabled()
    expect(
      await screen.findByText('Pedido nº 7 finalizado!')
    ).toBeInTheDocument()
    expect(store.getState().cart).toEqual([])
    expect(
      screen.getByRole('link', { name: 'Voltar à vitrine' })
    ).toHaveAttribute('href', '/')
  })

  describe('botões de quantidade', () => {
    const amount = store => store.getState().cart[0].amount
    const button = label => screen.getByRole('button', { name: label })

    it('conta dois cliques em + feitos antes da resposta do estoque', async () => {
      const store = renderCart([product])

      fireEvent.click(button('Aumentar'), { detail: 1 })
      fireEvent.click(button('Aumentar'), { detail: 1 })

      await vi.waitFor(() => expect(amount(store)).toBe(4))
    })

    it('conta dois cliques em - feitos em seguida', () => {
      const store = renderCart([{ ...product, amount: 3 }])

      fireEvent.click(button('Diminuir'), { detail: 1 })
      fireEvent.click(button('Diminuir'), { detail: 1 })

      expect(amount(store)).toBe(1)
    })

    it('não passa de 1 ao diminuir', () => {
      const store = renderCart([{ ...product, amount: 1 }])

      fireEvent.click(button('Diminuir'), { detail: 1 })

      expect(amount(store)).toBe(1)
    })

    it('conta o duplo clique como um clique só', async () => {
      const store = renderCart([product])

      fireEvent.click(button('Aumentar'), { detail: 1 })
      fireEvent.click(button('Aumentar'), { detail: 2 })
      await vi.waitFor(() => expect(amount(store)).toBe(3))

      fireEvent.click(button('Diminuir'), { detail: 1 })
      fireEvent.click(button('Diminuir'), { detail: 2 })
      expect(amount(store)).toBe(2)
    })
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
