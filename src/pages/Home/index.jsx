import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdAddShoppingCart } from 'react-icons/md'

import api from '../../services/api'
import { formatPrice } from '../../util/format'
import { singleClick } from '../../util/singleClick'
import { ProductList, Message } from './styles'
import { addToCartRequest } from '../../store/modules/cart/actions'
import { selectAmountById } from '../../store/modules/cart/selectors'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const amount = useSelector(selectAmountById)
  const dispatch = useDispatch()

  useEffect(() => {
    // Ignora a resposta que chega depois de a página sair da tela.
    let active = true
    api
      .get('/products')
      .then(response => active && setProducts(response.data))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <Message>Carregando produtos...</Message>
  }

  if (error) {
    return (
      <Message>
        Não foi possível carregar os produtos. Tente novamente mais tarde.
      </Message>
    )
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={singleClick(() => dispatch(addToCartRequest(product.id)))}
          >
            <div>
              <MdAddShoppingCart size={16} color="#ffffff" />{' '}
              {amount[product.id] || 0}
            </div>
            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  )
}

export default Home
