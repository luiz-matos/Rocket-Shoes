import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md'

import {
  checkout,
  removeFromCart,
  updateAmountRequest,
} from '../../store/modules/cart/actions'
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/modules/cart/selectors'
import { Container, EmptyCart, ProductTable, Total } from './styles'
import { colors } from '../../styles/colors'

function Cart() {
  const cart = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function increment(product) {
    dispatch(updateAmountRequest(product.id, product.amount + 1))
  }
  function decrement(product) {
    dispatch(updateAmountRequest(product.id, product.amount - 1))
  }
  function finishOrder() {
    dispatch(checkout())
    toast.success('Pedido finalizado!')
    navigate('/')
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
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color={colors.primary} />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
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
        <button type="button" onClick={finishOrder}>
          Finalizar pedido
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
