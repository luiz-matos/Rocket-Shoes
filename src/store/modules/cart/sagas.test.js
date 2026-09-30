import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { createAppStore } from '../../createAppStore'
import { addToCartRequest } from './actions'
import { checkoutRequest } from '../order/actions'

vi.mock('../../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }))

const stock = { 1: 3, 2: 5 }
const products = {
  1: { id: 1, title: 'Tênis 1', price: 100 },
  2: { id: 2, title: 'Tênis 2', price: 200 },
}

function respondAfter(ms) {
  api.get.mockImplementation(async url => {
    await new Promise(resolve => setTimeout(resolve, ms))
    const [, resource, id] = url.split('/')
    return {
      data:
        resource === 'stock'
          ? { id: Number(id), amount: stock[id] }
          : products[id],
    }
  })
}

const amounts = store =>
  store.getState().cart.map(({ id, amount }) => [id, amount])

beforeEach(() => {
  vi.clearAllMocks()
  respondAfter(10)
})

describe('pedidos do carrinho feitos em seguida', () => {
  it('adiciona os dois produtos quando o segundo é clicado antes da resposta do primeiro', async () => {
    const store = createAppStore()

    store.dispatch(addToCartRequest(1))
    store.dispatch(addToCartRequest(2))

    await vi.waitFor(() =>
      expect(amounts(store)).toEqual([
        [1, 1],
        [2, 1],
      ])
    )
  })

  it('atende os dois pedidos do mesmo produto feitos antes da primeira resposta', async () => {
    const store = createAppStore()

    store.dispatch(addToCartRequest(1))
    store.dispatch(addToCartRequest(1))

    await vi.waitFor(() => expect(amounts(store)).toEqual([[1, 2]]))
  })
})

describe('falha de rede', () => {
  it('avisa o erro e continua atendendo os pedidos seguintes', async () => {
    const store = createAppStore()
    api.get.mockRejectedValueOnce(new Error('Network Error'))

    store.dispatch(addToCartRequest(1))
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Não foi possível atualizar o carrinho. Tente novamente.'
      )
    )

    store.dispatch(addToCartRequest(2))
    await vi.waitFor(() => expect(amounts(store)).toEqual([[2, 1]]))
  })
})

describe('finalizar o pedido', () => {
  const inCart = amount => [{ ...products[1], image: 'um.jpg', amount }]

  it('grava o pedido, baixa o estoque e esvazia o carrinho', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 9 } })
    const store = createAppStore(inCart(2))

    store.dispatch(checkoutRequest())

    expect(store.getState().order.sending).toBe(true)
    await vi.waitFor(() =>
      expect(store.getState().order).toEqual({
        sending: false,
        lastOrderId: 9,
      })
    )
    expect(api.post).toHaveBeenCalledWith('/orders', {
      items: [{ id: 1, title: 'Tênis 1', price: 100, amount: 2 }],
      total: 200,
      createdAt: expect.any(String),
    })
    expect(api.patch).toHaveBeenCalledWith('/stock/1', { amount: 1 })
    expect(store.getState().cart).toEqual([])
  })

  it('não grava o pedido quando falta estoque', async () => {
    const store = createAppStore(inCart(4))

    store.dispatch(checkoutRequest())

    await vi.waitFor(() => expect(store.getState().order.sending).toBe(false))
    expect(toast.error).toHaveBeenCalledWith(
      'Sem estoque suficiente de Tênis 1.'
    )
    expect(api.post).not.toHaveBeenCalled()
    expect(amounts(store)).toEqual([[1, 4]])
  })

  it('mantém o carrinho e avisa quando a gravação falha', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'))
    const store = createAppStore(inCart(2))

    store.dispatch(checkoutRequest())

    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Não foi possível finalizar o pedido. Tente novamente.'
      )
    )
    expect(store.getState().order).toEqual({
      sending: false,
      lastOrderId: null,
    })
    expect(api.patch).not.toHaveBeenCalled()
    expect(amounts(store)).toEqual([[1, 2]])
  })

  it('tira a confirmação quando um produto novo entra no carrinho', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 9 } })
    const store = createAppStore(inCart(1))
    store.dispatch(checkoutRequest())
    await vi.waitFor(() => expect(store.getState().order.lastOrderId).toBe(9))

    store.dispatch(addToCartRequest(2))

    await vi.waitFor(() =>
      expect(store.getState().order.lastOrderId).toBe(null)
    )
  })
})
