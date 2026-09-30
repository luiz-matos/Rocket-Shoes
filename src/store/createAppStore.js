import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'

// Monta o store com os sagas rodando. Separado do index para os testes
// criarem um store novo com o carrinho que precisam.
export function createAppStore(cart = []) {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { cart },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
    devTools: import.meta.env.DEV,
  })

  sagaMiddleware.run(rootSaga)

  return store
}
