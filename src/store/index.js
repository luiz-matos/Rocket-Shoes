import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f

const enhancer = import.meta.env.DEV
  ? compose(applyMiddleware(sagaMiddleware), devTools)
  : null

const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export default store
