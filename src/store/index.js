import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'
import { loadCart, saveCart } from './cartStorage'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  preloadedState: { cart: loadCart() },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
})

store.subscribe(() => saveCart(store.getState().cart))

sagaMiddleware.run(rootSaga)

export default store
