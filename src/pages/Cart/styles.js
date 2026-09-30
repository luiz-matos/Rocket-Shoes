import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  padding: 30px;
  background-color: #ffffff;
  border-radius: 4px;
  footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    button {
      background-color: #5aaeb8;
      color: #ffffff;
      border: 0;
      border-radius: 4px;
      padding: 12px 20px;
      font-weight: bold;
      text-transform: uppercase;
      transition: background-color 0.2s;
      &:hover {
        background-color: ${darken(0.03, '#5aaeb8')};
      }
    }
  }
`

export const ProductTable = styled.table`
  width: 100%;
  thead th {
    color: #999999;
    text-align: left;
    padding: 12px;
  }
  tbody td {
    padding: 12px;
    border-bottom: 1px solid #eeeeee;
  }
  img {
    height: 100px;
  }
  strong {
    color: #333333;
    display: block;
  }
  span {
    display: block;
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
  }
  div {
    display: flex;
    align-items: center;
    input {
      border: 1px solid #dddddd;
      border-radius: 4px;
      color: #666666;
      padding: 6px;
      width: 50px;
    }
  }
  button {
    background: none;
    border: 0;
    padding: 6px;
  }
`

export const Total = styled.div`
  display: flex;
  align-items: baseline;
  span {
    color: #999999;
    font-weight: bold;
  }
  strong {
    font-size: 28px;
    margin-left: 5px;
  }
`
