# 👟 Rocket Shoes

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit 2">
  <img src="https://img.shields.io/badge/Redux%20Saga-1.5-999999?style=for-the-badge&logo=reduxsaga&logoColor=white" alt="Redux Saga 1.5">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/React%20Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router 7">
  <img src="https://img.shields.io/badge/styled--components-6-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white" alt="styled-components 6">
  <img src="https://img.shields.io/badge/Vitest-5-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest 5">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow?style=for-the-badge" alt="Licença MIT">
</div>

<br>

> 🎯 **Loja de tênis em React com o carrinho na arquitetura Flux**, usando Redux Toolkit para o estado e Redux Saga para consultar o estoque antes de cada mudança no carrinho.

Fiz em 2020 para estudar a arquitetura Flux, e o repositório se chamava Arquitetura-Flux. Em 2026 voltei a ele: troquei o Create React App, descontinuado, pelo Vite, corrigi os bugs, completei a loja com carrinho salvo e pedido gravado na API, e passei o store para o Redux Toolkit mantendo os sagas.

<p align="center">
  <img src="demo/rocket-shoes.gif" alt="Produtos adicionados ao carrinho, aviso de falta de estoque, quantidades alteradas e pedido finalizado" width="880">
</p>

## 📋 Índice

- [🎓 O que aprendi](#-o-que-aprendi)
- [🚀 Como rodar](#-como-rodar)
- [🧠 Decisões técnicas](#-decisões-técnicas)
- [🔄 Revisitando o projeto em 2026](#-revisitando-o-projeto-em-2026)
- [📄 Licença](#-licença)

## 🎓 O que aprendi

- **No Flux, a tela não altera o estado.** Ela despacha uma action, e o estado só muda no reducer. O que depende da API (adicionar, aumentar e finalizar) passa pelos sagas, que consultam o estoque; o que não depende (diminuir e remover) vai direto ao reducer.
- **Efeitos ao mesmo tempo precisam de ordem.** O `takeLatest` cancelava o pedido anterior de qualquer produto, e clicar em dois tênis seguidos deixava só o segundo no carrinho. Com uma fila (`actionChannel`), cada pedido parte do carrinho que o anterior deixou.
- **A tela deve mandar a intenção, não o resultado.** O + do carrinho mandava a quantidade da tela mais 1, e dois cliques rápidos mandavam o mesmo número. Agora manda "some 1", e a conta é feita sobre o carrinho atual.
- **Estado mínimo, o resto se calcula.** O preço formatado era gravado no estado e no `localStorage`, e o total era recalculado em cada tela. Agora o carrinho guarda só produto e quantidade, e o resto sai dos seletores.
- **O build de produção não é o de desenvolvimento.** O app abria em desenvolvimento e ficava em branco em produção, porque, fora do modo de desenvolvimento, o store recebia `null` como estado inicial.
- **Corrigir com teste que falha antes.** Cada bug corrigido ganhou um teste que falhava antes e passa depois, e a reorganização do código foi comparada tela a tela com o resultado anterior.

## 🚀 Como rodar

Precisa de Node 22.12 ou mais novo e do Yarn. A loja usa uma API fake do json-server, que volta ao estoque original a cada execução.

```bash
yarn          # dependências
yarn server   # API em http://127.0.0.1:3333, num terminal
yarn dev      # loja em http://localhost:5173, em outro
```

Os 34 testes rodam com `yarn test`. Com a extensão [Redux DevTools](https://github.com/reduxjs/redux-devtools) no navegador, dá para acompanhar cada action e o estado do carrinho.

## 🧠 Decisões técnicas

| Decisão | Alternativa | Por quê |
|---|---|---|
| Vite | Create React App | O CRA foi descontinuado e não roda mais no Node atual |
| Redux Toolkit mantendo os sagas | RTK Query ou o listener do Toolkit | O projeto existe para estudar o fluxo Flux com efeitos isolados |
| Fila de pedidos com `actionChannel` | `takeLatest` ou `takeEvery` | Um cancelava pedidos de outros produtos; o outro deixaria dois cliques lerem o mesmo carrinho. O custo é cliques seguidos esperarem um ao outro |
| Duplo clique contado pelo `event.detail` | Intervalo fixo em milissegundos | Respeita o intervalo de duplo clique configurado no sistema de cada pessoa |
| Redux DevTools | Reactotron | Mostra as actions no próprio navegador, sem app desktop |
| Estoque conferido de novo ao finalizar | Confiar no que foi conferido ao adicionar | O estoque pode ter mudado; o json-server não tem transação, e numa API de verdade isso seria uma operação só no servidor |

## 🔄 Revisitando o projeto em 2026

O projeto não rodava mais: o webpack 4 do `react-scripts` 3.4 usa MD4, que o OpenSSL 3 do Node 17 em diante recusa. Contornando isso, a revisão achou um build de produção que não abria e um carrinho que perdia cliques. Dos 7 bugs corrigidos, os principais:

| O que estava errado | O que mudou |
|---|---|
| Tela em branco no build de produção | O middleware do Saga entra sempre; só o DevTools depende do modo |
| Clicar num produto e logo em outro deixava só o segundo no carrinho | Fila de pedidos com `actionChannel` |
| Dois cliques no + ou no - mudavam a quantidade uma vez só | O + soma 1 ao carrinho atual; o - vai direto ao reducer |
| Depois de uma falha de rede, o carrinho parava de responder | O erro é tratado na fila, com aviso, e a fila continua |
| Vitrine vazia e sem aviso com a API fora do ar | Aviso de erro na vitrine |

## 📄 Licença

[MIT](LICENSE)

---

<div align="center">
  <p>Desenvolvido por <strong>Luiz Matos</strong></p>
  <p>
    <a href="https://github.com/luiz-matos">GitHub</a> •
    <a href="https://www.linkedin.com/in/luizeduardomatos/">LinkedIn</a>
  </p>
</div>
