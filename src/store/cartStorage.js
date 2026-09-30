const CART_KEY = '@RocketShoes:cart'

// localStorage pode estar bloqueado ou guardar um valor inválido: nesses
// casos o carrinho começa vazio em vez de quebrar a aplicação.
export function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch {
    // Sem localStorage o carrinho só não sobrevive ao recarregar.
  }
}
