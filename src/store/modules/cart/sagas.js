import { actionChannel, call, select, put, take } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import {
  addToCartRequest,
  addToCartSuccess,
  updateAmountSuccess,
} from './actions'
import { selectCartTotalValue } from './selectors'
import {
  checkoutFailure,
  checkoutRequest,
  checkoutSuccess,
} from '../order/actions'

function* fetchStock(id) {
  const { data: stock } = yield call(api.get, `/stock/${id}`)
  return stock.amount
}

function* hasStock(id, amount) {
  const stock = yield call(fetchStock, id)
  if (amount > stock) {
    toast.error('Quantidade solicitada fora de estoque.')
    return false
  }
  return true
}

function* addToCart({ payload: id }) {
  const productInCart = yield select(state => state.cart.find(p => p.id === id))
  const amount = (productInCart?.amount ?? 0) + 1

  if (!(yield call(hasStock, id, amount))) return

  if (productInCart) {
    yield put(updateAmountSuccess(id, amount))
  } else {
    const { data: product } = yield call(api.get, `/products/${id}`)
    yield put(addToCartSuccess({ ...product, amount }))
  }
}

function* placeOrder(cart) {
  const stocks = []
  for (const product of cart) {
    const stock = yield call(fetchStock, product.id)
    if (product.amount > stock) {
      toast.error(`Sem estoque suficiente de ${product.title}.`)
      return null
    }
    stocks.push(stock)
  }

  const { data: order } = yield call(api.post, '/orders', {
    items: cart.map(({ id, title, price, amount }) => ({
      id,
      title,
      price,
      amount,
    })),
    total: yield select(selectCartTotalValue),
    createdAt: new Date().toISOString(),
  })

  for (const [index, product] of cart.entries()) {
    yield call(api.patch, `/stock/${product.id}`, {
      amount: stocks[index] - product.amount,
    })
  }

  return order.id
}

function* checkout() {
  const cart = yield select(state => state.cart)
  try {
    const orderId = cart.length > 0 ? yield call(placeOrder, cart) : null
    yield put(orderId ? checkoutSuccess(orderId) : checkoutFailure())
  } catch (error) {
    yield put(checkoutFailure())
    throw error
  }
}

const handlers = {
  [addToCartRequest.type]: {
    saga: addToCart,
    errorMessage: 'Não foi possível atualizar o carrinho. Tente novamente.',
  },
  [checkoutRequest.type]: {
    saga: checkout,
    errorMessage: 'Não foi possível finalizar o pedido. Tente novamente.',
  },
}

// Fila: cada pedido espera o anterior terminar, para nenhum clique ser
// cancelado e cada um partir da quantidade que o anterior deixou no carrinho.
function* watchCartRequests() {
  const channel = yield actionChannel(Object.keys(handlers))
  while (true) {
    const action = yield take(channel)
    const { saga, errorMessage } = handlers[action.type]
    try {
      yield call(saga, action)
    } catch {
      toast.error(errorMessage)
    }
  }
}

export default call(watchCartRequests)
