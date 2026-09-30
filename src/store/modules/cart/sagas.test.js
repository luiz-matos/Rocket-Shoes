import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import rootReducer from '../rootReducer'
import rootSaga from '../rootSaga'
import { addToCartRequest, updateAmountRequest } from './actions'

vi.mock('../../../services/api', () => ({ default: { get: vi.fn() } }))
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

function createCartStore(initialCart = []) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    { cart: initialCart },
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)
  return store
}

const amounts = store =>
  store.getState().cart.map(({ id, amount }) => [id, amount])

beforeEach(() => {
  vi.clearAllMocks()
  respondAfter(10)
})

describe('pedidos do carrinho feitos em seguida', () => {
  it('adiciona os dois produtos quando o segundo é clicado antes da resposta do primeiro', async () => {
    const store = createCartStore()

    store.dispatch(addToCartRequest(1))
    store.dispatch(addToCartRequest(2))

    await vi.waitFor(() =>
      expect(amounts(store)).toEqual([
        [1, 1],
        [2, 1],
      ])
    )
  })

  it('conta os dois cliques rápidos no mesmo produto', async () => {
    const store = createCartStore()

    store.dispatch(addToCartRequest(1))
    store.dispatch(addToCartRequest(1))

    await vi.waitFor(() => expect(amounts(store)).toEqual([[1, 2]]))
  })

  it('altera a quantidade dos dois produtos quando o segundo é alterado antes da resposta do primeiro', async () => {
    const store = createCartStore([
      { ...products[1], amount: 1 },
      { ...products[2], amount: 1 },
    ])

    store.dispatch(updateAmountRequest(1, 2))
    store.dispatch(updateAmountRequest(2, 2))

    await vi.waitFor(() =>
      expect(amounts(store)).toEqual([
        [1, 2],
        [2, 2],
      ])
    )
  })
})

describe('falha de rede', () => {
  it('avisa o erro e continua atendendo os pedidos seguintes', async () => {
    const store = createCartStore()
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
