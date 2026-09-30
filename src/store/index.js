import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './modules/rootReducer'
import rootSaga from './modules/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const devTools =
  import.meta.env.DEV && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f

const enhancer = compose(applyMiddleware(sagaMiddleware), devTools)

const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export default store
