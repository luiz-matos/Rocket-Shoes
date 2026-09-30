import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { MdAddShoppingCart } from 'react-icons/md'

import api from '../../services/api'
import { formatPrice } from '../../util/format'
import { ProductList, Message } from './styles'
import * as CartActions from '../../store/modules/cart/actions'
import { selectAmountById } from '../../store/modules/cart/selectors'
class Home extends Component {
  state = {
    products: [],
    loading: true,
    error: false,
  }

  async componentDidMount() {
    try {
      const response = await api.get('/products')
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }))
      this.setState({ products: data })
    } catch {
      this.setState({ error: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props
    addToCartRequest(id)
  }

  render() {
    const { products, loading, error } = this.state
    const { amount } = this.props

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
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
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
}

const mapStateToProps = state => ({
  amount: selectAmountById(state),
})

const mapDispatchToProps = dispatch => bindActionCreators(CartActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
