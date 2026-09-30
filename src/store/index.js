import { createAppStore } from './createAppStore'
import { loadCart, saveCart } from './cartStorage'

const store = createAppStore(loadCart())

store.subscribe(() => saveCart(store.getState().cart))

export default store
