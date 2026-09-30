import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import api from '../../services/api'
import rootReducer from '../../store/modules/rootReducer'
import Home from '.'

vi.mock('../../services/api', () => ({ default: { get: vi.fn() } }))

function renderHome() {
  return render(
    <Provider store={createStore(rootReducer)}>
      <Home />
    </Provider>
  )
}

describe('vitrine', () => {
  it('lista os produtos com o preço formatado', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Tênis', price: 179.9, image: 'tenis.jpg' }],
    })

    renderHome()

    expect(await screen.findByText('Tênis')).toBeInTheDocument()
    expect(screen.getByText('R$ 179,90')).toBeInTheDocument()
  })

  it('avisa quando a API não responde', async () => {
    api.get.mockRejectedValueOnce(new Error('Network Error'))

    renderHome()

    expect(
      await screen.findByText('Não foi possível carregar os produtos. Tente novamente mais tarde.')
    ).toBeInTheDocument()
  })
})
