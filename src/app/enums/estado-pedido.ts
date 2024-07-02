export enum EstadoPedido {
  Abierto = 'Abierto', //Estado Inicial
  Pendiente = 'Pendiente', //Esta Haciendo el pedido
  Aceptado = 'Aceptado', //Acepto el Mozo
  EnPreparacion = 'En Preparación', //Esta cocinando
  Listo = 'Listo',  //Listo para entregar
  Servido = 'Servido', //El cliente confirmo que recibio el pedido
  CuentaSolicitada = 'Cuenta Solicitada', //El cliente solicito la cuenta
  Pagado = 'Pagado', //El cliente pago - Estado Final
  Cerrado = 'Cerrado' //El mozo cerro el pedido - Estado Final
}

export enum EstadoPedidoProducto {
  Pendiente = 'Pendiente', //Esta Haciendo el pedido
  EnPreparacion = 'En Preparación', //Esta cocinando
  Listo = 'Listo',  //Listo para entregar
}
