import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin: 40px 0;
  img {
    display: block;
    max-width: 100%;
  }
  @media (max-width: 600px) {
    margin: 20px 0;
    > a:first-child {
      width: 160px;
    }
  }
`
export const Cart = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
  div {
    text-align: right;
    margin-right: 10px;
    strong {
      display: block;
      color: #ffffff;
    }
    span {
      font-size: 12px;
      color: #999999;
    }
  }
`
