export enum EstadoPedido {
  Abierto = 'Abierto', //Estado Inicial
  Pendiente = 'Pendiente', //Esta Haciendo el pedido
  Aceptado = 'Aceptado', //Acepto el Mozo
  EnPreparacion = 'En Preparación', //Esta cocinando
  Listo = 'Listo',  //Listo para entregar
  Entregado = 'Entregado', //Entregado al cliente
  Confirmado = 'Confirmado', //El cliente confirmo que recibio el pedido
  Pagado = 'Pagado', //El cliente pago - Estado Final
  Cerrado = 'Cerrado' //El mozo cerro el pedido - Estado Final
}
