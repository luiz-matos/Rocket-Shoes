import { darken } from 'polished'

const primary = '#5aaeb8'

export const colors = {
  primary,
  primaryHover: darken(0.03, primary),
  primaryDark: darken(0.1, primary),
}
