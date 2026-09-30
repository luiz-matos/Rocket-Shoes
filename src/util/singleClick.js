// O navegador numera os cliques seguidos em event.detail (1, 2, 3...) dentro
// do intervalo de duplo clique do sistema. Só o primeiro vale, para um duplo
// clique por engano não contar duas vezes. Teclado chega com detail 0.
export function singleClick(handler) {
  return event => {
    if (event.detail > 1) return
    handler(event)
  }
}
