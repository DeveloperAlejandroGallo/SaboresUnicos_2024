export enum EstadoPedido {
  Pendiente = 'Pendiente', //Esta Haciendo el pedido
  Aceptado = 'Aceptado', //Acepto el Mozo
  EnPreparacion = 'En preparación', //Esta cocinando
  Listo = 'Listo',  //Listo para entregar
  Entregado = 'Entregado', //Entregado al cliente
  Confirmado = 'Confirmado', //El cliente confirmo que recibio el pedido
  Pagado = 'Pagado', //El cliente pago - Estado Final
}
