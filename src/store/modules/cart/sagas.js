import { actionChannel, call, select, put, take } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import {
  addToCartRequest,
  addToCartSuccess,
  updateAmountRequest,
  updateAmountSuccess,
} from './actions'
import { formatPrice } from '../../../util/format'

function* hasStock(id, amount) {
  const { data: stock } = yield call(api.get, `/stock/${id}`)
  if (amount > stock.amount) {
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
    yield put(
      addToCartSuccess({
        ...product,
        amount,
        priceFormatted: formatPrice(product.price),
      })
    )
  }
}

function* updateAmount({ payload: { id, amount } }) {
  if (amount <= 0) return
  if (!(yield call(hasStock, id, amount))) return
  yield put(updateAmountSuccess(id, amount))
}

const handlers = {
  [addToCartRequest.type]: addToCart,
  [updateAmountRequest.type]: updateAmount,
}

// Fila: cada pedido espera o anterior terminar, para nenhum clique ser
// cancelado e cada um partir da quantidade que o anterior deixou no carrinho.
function* watchCartRequests() {
  const channel = yield actionChannel(Object.keys(handlers))
  while (true) {
    const action = yield take(channel)
    try {
      yield call(handlers[action.type], action)
    } catch {
      toast.error('Não foi possível atualizar o carrinho. Tente novamente.')
    }
  }
}

export default call(watchCartRequests)
