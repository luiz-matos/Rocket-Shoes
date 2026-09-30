import { all } from 'redux-saga/effects'

import cart from './cart/sagas'

function* rootSaga() {
  return yield all([cart])
}

export default rootSaga
