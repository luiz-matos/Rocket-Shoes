import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { createAppStore } from '../../store/createAppStore'
import Header from '.'

function renderHeader(cart) {
  return render(
    <Provider store={createAppStore(cart)}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  )
}

const product = id => ({ id, title: `Tênis ${id}`, price: 100, amount: 1 })

describe('cabeçalho', () => {
  it.each([
    [[], '0 itens'],
    [[product(1)], '1 item'],
    [[product(1), product(2)], '2 itens'],
  ])('mostra a quantidade de produtos no carrinho', (cart, text) => {
    renderHeader(cart)

    expect(screen.getByText(text)).toBeInTheDocument()
  })
})
