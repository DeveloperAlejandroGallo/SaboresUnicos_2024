# La Comanda: Práctica Profesional Supervisada 2024
_La Comanda es una aplicación de gestión de para Restaurantes que deseen automatizar muchas de las acciones diarias en el local._

## **Instalación del Proyecto** 📋
```bash
git clone https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024.git
cd SaboresUnicos_2024
npm install
ionic build
ionic serve
```


## **Integrantes del equipo** ✒️
```
Calani, Romina
Gallo, Alejandro
Gonzalez, Martín
```

## **Nuestro Logo**
<img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2Ffavicon.ico?alt=media&token=95b1f3ae-a100-4ab5-be68-c7da141c97b4" height="200">

## **Login**
<img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2FLogin.png?alt=media&token=3c00b62e-7db9-444b-ac45-435b27396d2c" height="500">

## **Email de Confirmación**
<img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2FMailSaboresUnicos.png?alt=media&token=417dbc22-534d-4abe-b991-66128f16a469" height="500">

## **El Push Notification**

| Nuevo Cliente | Mesa Asignada | Consulta al Mozo |
| ------ | ------ | ------ |
| <img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2Fpush.jpg?alt=media&token=fd4aa634-8b75-4df6-b422-0f4254efe651" height="500">| <img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2FIMG-20240625-WA0090.jpg?alt=media&token=4dfb9b40-e317-4131-8c4d-dbf50e9f1352 " height="500"> | <img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/PushMozo.jpg"  height="500" /> |

## **Alta Registrada**

<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/AltaRegistrada.gif" height="600">


## **Ingreso Anónimo**
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/IngresoAnonimo.gif" height="600">


## **Flujo de la Aplicación**
> _Decidimos tomar algunas decisiones de diseño dado que queríamos hacer una aplicación acorde a un uso diario._
> _Por tal razón desarrollamos un flujo de estados y colores en el cual se mueve un pedido en la aplición de Sabores Únicos._

**Ingreso a la lista de Espera:**
> _El cliente quedo en lista de espera, una vez que el Maitre Acepta su ingreso, el Pedido queda en estado **MESA ASIGNADA**_

**Escanea Mesa:**
> _Una vez que la mesa correcta es escaneada, el pedido queda en estado **ABIERTO** listo para recibir los pruductos que desea consumir.
> Desde el resumen se puede acceder al detalle del pedido y las diferentes acciones estarán en el boton principal._

<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Abierto.png" height="500">

**Envía Pedido:**
> _Al presionar **ENVIAR PEDIDO** el pedido es recibido por el Mozo y su estado cambia a **PENDIENTE**_
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Pendiente.png" height="500">

**Aceptar Pedido:**
> _Acción llevada por el Mozo, el cual al aceptarlo deja el pedido en estado **ACEPTADO** y le llega a cada Empleado sea Cocinero o Bartender,
> el producto que debe preprar._
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Aceptado.jpg" height="500">

**Preparando el Pedido:**
> _Acción llevada por el Cocinero o Bartender. El cual se activa y deja el pedido en estado **EN PREPARACION**, en el momento en el que el
> primer Empleado comienza a preparar alguno de los productos._
> _En este momento el Cliente comienza a ver un reloj en cuenta regresiva de llegada de supedido._
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/EnPreparacion.jpg" height="500">

**Pedido Listo:**
> _Cuando se termina de prepara el último producto, el estado del pedido cambia a **LISTO**, estado que avisa al mozo que ya puede llevar el pedido._
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Listo.jpg" height="500">

**Pedido Confirmado**
> _Acción llevada por el Cliente para confirmar la llegada del pedido a la mesa. El cual deja el pedido en estado **CONFIRMADO**, dando opcion al clinete de
> poder cargar una Encuesta, Ingresar Propina por QR o Solicitar la Cuenta_
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Recibido.jpg" height="500">

**Cuenta Solicitada**
> _Acción llevada por el Cliente el cual genera un aviso al Mozo informando los tatales, dejando el pedido en estado **CUENTA SOLICITADA** y dando la opcion a Pagar con QR o Confirmar que se pagó con Efectivo o Tarjeta_
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/SolicitarCuenta.jpg" height="500">

**Pagando**
> _Una vez pago con QR o Presionando el Boton, el estado cambia a **PAGADO** avisando al Mozo y dandole la opción al mismo de confirmar el pago_
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Pagado.jpg" height="500">

**Confirmando Pago**
> _Una vez que el Mozo confirma el pago, el estado del pedido queda **CERRADO**, dando fin al flujo de uso._
<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Estados/Cerrado.jpg" height="500">


## **BITACORA DE APROBACIÓN** 🛠️

<img src="https://github.com/DeveloperAlejandroGallo/SaboresUnicos_2024/blob/master/archivosReadme/Aprobacion%201%20a%203.png" height="800">


## **Detalles de la construcción** 🛠️
### Semana 1: Sábado 08/06 al 15/06 💻
>**Calani, Romina**
- [x] Diseño de Icono.
- [x] Diseño de Gif.
- [x] Paleta de Colores.
- [x] Pantalla de Login.

>**Gallo, Alejandro**
- [x] Configuración de base de datos para abordar el proyecto.
- [x] Creación de la estructura de la aplicación.
- [x] Armado de Repositorio Git
- [x] Creación de Readme.md.
- [x] Desarrollo de Pantalla de Registro Anónimo y Client.

>**Gonzalez, Martín**
- [x] Splash Animado.
- [x] Agregado de funcionalidad de Lectura de DNI para las pantallas de Registro.
- [x] Agregado de Sonidos a la apliacion.

 ### Semana 2: Sábado 15/06 al 22/06 💻
>**Calani, Romina**
- [x] Diseño de tab Home para toda la app.
- [x] Diseño de Header para toda la aplicacion.
- [x] Diseño de sección Mi Perfil.
- [x] Desarrollo de Ingreso al Local con lectura de QR.
- [x] Visualizacion Lista Encuestas

>**Gallo, Alejandro**
- [x] Definición de tareas y armado de proyecto kanva en Git Proyects.
- [x] Desarrollo de pantallas de Registro de Cliente Registrado y Anónimo.
- [x] Desarrollo de pantalla de Listado de Pendientes para Home Dueño y Supervisor.
- [x] Desarrollo de activar/desactivar Sonidos.
- [x] Investigación de envío de correo.
- [x] Mantención de Readme.md.
- [x] Manejo de todos los merge y Pull Request

>**Gonzalez, Martín**
- [ ] Investigación y desarrollo de Push Notification.
- [ ] Creación de Listado de Pendientes de Asignar a Mesa como Home de Maitre.

  ### Semana 3: Sábado 22/06 al 29/06 💻
>**Calani, Romina**
- [x] Diseño de Qrs
- [x] Logica de Lectura de Qr
- [x] Definición de Modelos del Sistema (los 3).
- [x] Grabado de Video Segunda Entrega.
- [ ] Menu de Mozo.

>**Gallo, Alejandro**
- [x] Mantención de Readme.md.
- [x] Manejo de todos los merge y Pull Request
- [x] Investigación y desarrollo de Push Notification.
- [x] Implementación Envío de Mails.
- [x] Hosting Firebase
- [x] Creación de Servicios necesarios para todas las colecciones.
- [x] Definición de Modelos del Sistema (los 3).
- [x] Grabado de Video Segunda Entrega.
- [x] Logica de estados para Rechazado.
- [x] Todas las llamadas Push y metodos de mail.
- [x] Mail enviado con estilo.
- [x] Alta para todas las entidades!
- [x] Diseño de importe
- [x] Logica de pedido
- [x] Rediseño de Tabs de Menu


>**Gonzalez, Martín**
- [x] Creación de Listado de Pendientes de Asignar a Mesa como Home de Maitre.
- [x] Logica de Asignación de Mesa y borrado de espera
- [x] Desarrollo del front de Menu de comidas
- [x] Definición de Modelos del Sistema (los 3).
- [x] Grabado de Video Segunda Entrega.
- [ ] Frontend de Chat y Logica.

  ### Semana 4: Sábado 29/06 al 3/07 💻
>**Calani, Romina**
- [x] Diseño de pantallas del Mozo, Cocinero y Bartender
- [x] Diseño de lista de productos asociados al Pedido del cliente
- [x] Desarrollo de confirmación del pedido por parte del Mozo
- [x] Desarrollo de realización de pedidos por parte del Cocinero/bartender
- [x] Lógica para mantener el pedido actualizado en las listas del Mozo
- [x] Desarrollo de confirmación de Pago por parte del Mozo
- [x] Desarrollo de liberación de Mesa y cierre del Pedido
- [x] Modificación de lógica en las Propinas
- [x] Modificación de altas Encuestas


>**Gallo, Alejandro**
- [x] Mantención de Readme.md.
- [x] Manejo de todos los merge y Pull Request
- [x] Manejo de Proyect y delegacion de tareas.
- [x] Desarrollo de Logica de Pedido completa, manteniendo estados
- [x] Desarrollo de pantalla de detalle de cuenta
- [x] Desarrollo de Pago con QR
- [x] Desarrollo Propina
- [x] Logica de Encuesta
- [x] Pipes para mejor visualización

>**Gonzalez, Martín**
- [x] Finalización del frontend de chat y logica
- [x] Grabación de video de la tercera entrega.
- [x] Desarrollo de la pantalla y lógica de creación de la encuesta.
- [x] Creación de la pantalla y lógica de los gráficos de las encuestas.
