import styled from 'styled-components'
import { colors } from '../../styles/colors'

export const Container = styled.div`
  padding: 30px;
  background-color: #ffffff;
  border-radius: 4px;
  @media (max-width: 600px) {
    padding: 15px;
  }
  footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column-reverse;
      gap: 20px;
    }
    button {
      background-color: ${colors.primary};
      color: #ffffff;
      border: 0;
      border-radius: 4px;
      padding: 12px 20px;
      font-weight: bold;
      text-transform: uppercase;
      transition: background-color 0.2s;
      &:hover {
        background-color: ${colors.primaryHover};
      }
      &:disabled {
        opacity: 0.7;
        cursor: wait;
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
    &:disabled {
      opacity: 0.4;
      cursor: wait;
    }
  }
  @media (max-width: 600px) {
    th:first-child,
    td:first-child {
      display: none;
    }
    thead th,
    tbody td {
      padding: 12px 4px;
    }
    div input {
      width: 40px;
    }
    button {
      padding: 2px;
    }
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

export const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  strong {
    font-size: 18px;
    color: #333333;
  }
  a {
    margin-top: 15px;
    color: ${colors.primary};
    font-weight: bold;
    text-decoration: none;
    &:hover {
      color: ${colors.primaryDark};
    }
  }
`
