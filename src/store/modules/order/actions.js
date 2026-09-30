import { createAction } from '@reduxjs/toolkit'

// Pedido atendido pelos sagas: confere o estoque, grava o pedido e baixa o
// estoque na API.
export const checkoutRequest = createAction('order/checkoutRequest')

export const checkoutSuccess = createAction('order/checkoutSuccess')

export const checkoutFailure = createAction('order/checkoutFailure')
