import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md'

import {
  addToCartRequest,
  decrementAmount,
  removeFromCart,
} from '../../store/modules/cart/actions'
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/modules/cart/selectors'
import { checkoutRequest } from '../../store/modules/order/actions'
import { selectOrder } from '../../store/modules/order/selectors'
import { Container, EmptyCart, ProductTable, Total } from './styles'
import { colors } from '../../styles/colors'
import { singleClick } from '../../util/singleClick'

function Cart() {
  const cart = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { sending, lastOrderId } = useSelector(selectOrder)
  const dispatch = useDispatch()

  function increment(product) {
    dispatch(addToCartRequest(product.id))
  }
  function decrement(product) {
    dispatch(decrementAmount(product.id))
  }
  function finishOrder() {
    dispatch(checkoutRequest())
  }

  if (cart.length === 0 && lastOrderId) {
    return (
      <Container>
        <EmptyCart>
          <strong>Pedido nº {lastOrderId} finalizado!</strong>
          <Link to="/">Voltar à vitrine</Link>
        </EmptyCart>
      </Container>
    )
  }

  if (cart.length === 0) {
    return (
      <Container>
        <EmptyCart>
          <strong>Seu carrinho está vazio</strong>
          <Link to="/">Ver os produtos</Link>
        </EmptyCart>
      </Container>
    )
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <tr key={product.id}>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    aria-label="Diminuir"
                    disabled={sending}
                    onClick={singleClick(() => decrement(product))}
                  >
                    <MdRemoveCircleOutline size={20} color={colors.primary} />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button
                    type="button"
                    aria-label="Aumentar"
                    disabled={sending}
                    onClick={singleClick(() => increment(product))}
                  >
                    <MdAddCircleOutline size={20} color={colors.primary} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  aria-label="Remover"
                  disabled={sending}
                  onClick={() => dispatch(removeFromCart(product.id))}
                >
                  <MdDelete size={20} color={colors.primary} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
      <footer>
        <button
          type="button"
          disabled={sending}
          onClick={singleClick(finishOrder)}
        >
          {sending ? 'Enviando pedido...' : 'Finalizar pedido'}
        </button>
        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  )
}

export default Cart
