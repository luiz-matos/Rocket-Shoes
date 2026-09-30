import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MdShoppingBasket } from 'react-icons/md'

import { Container, Cart } from './styles'
import logo from '../../assets/images/header.svg'
import { selectCartSize } from '../../store/modules/cart/selectors'

function Header() {
  const cartSize = useSelector(selectCartSize)

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="RocketShoes" />
      </Link>
      <Cart to="/cart">
        <div>
          <strong>Meu Carrinho</strong>
          <span>
            {cartSize} {cartSize === 1 ? 'item' : 'itens'}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#ffffff" />
      </Cart>
    </Container>
  )
}

export default Header
