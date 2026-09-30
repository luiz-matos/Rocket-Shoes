import { actionChannel, call, select, put, take } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { addToCartSuccess, updateAmountSuccess } from './actions'
import { formatPrice } from '../../../util/format'

function* addToCart({ id }) {
  const productExists = yield select(state => state.cart.find(p => p.id === id))
  const stock = yield call(api.get, `/stock/${id}`)
  const stockAmount = stock.data.amount
  const currentAmount = productExists ? productExists.amount : 0
  const amount = currentAmount + 1

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque.')
    return
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount))
  } else {
    const response = yield call(api.get, `/products/${id}`)
    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    }
    yield put(addToCartSuccess(data))
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return
  const stock = yield call(api.get, `/stock/${id}`)
  const stockAmount = stock.data.amount
  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque.')
    return
  }
  yield put(updateAmountSuccess(id, amount))
}

const handlers = {
  '@cart/ADD_REQUEST': addToCart,
  '@cart/UPDATE_AMOUNT_REQUEST': updateAmount,
}

// Fila: cada pedido espera o anterior terminar, para nenhum clique ser
// cancelado e cada um partir da quantidade que o anterior deixou no carrinho.
function* watchCartRequests() {
  const channel = yield actionChannel(Object.keys(handlers))
  while (true) {
    const action = yield take(channel)
    yield call(handlers[action.type], action)
  }
}

export default call(watchCartRequests)
