import styled from 'styled-components'
import { darken } from 'polished'

export const ProductList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px;
  list-style: none;
  li {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px;
    img {
      align-self: center;
      max-width: min(250px, 100%);
    }
    > strong {
      font-size: 16px;
      line-height: 20px;
      color: #333333;
      margin-top: 5px;
    }
    > span {
      font-size: 20px;
      font-weight: bold;
      margin: 5px 0 20px;
    }
    button {
      background-color: #5aaeb8;
      color: #ffffff;
      border: 0;
      border-radius: 4px;
      overflow: hidden;
      margin-top: auto;
      display: flex;
      align-items: center;
      transition: background-color 0.2s;
      &:hover {
        background-color: ${darken(0.03, '#5aaeb8')};
      }
      div {
        display: flex;
        align-items: center;
        padding: 12px;
        background-color: rgba(0, 0, 0, 0.1);
        svg {
          margin-right: 5px;
        }
      }
      span {
        flex: 1;
        text-align: center;
        font-weight: bold;
      }
    }
  }
`

export const Message = styled.p`
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  margin-top: 50px;
`
