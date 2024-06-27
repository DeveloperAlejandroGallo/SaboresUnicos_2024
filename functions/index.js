/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const express = require("express");
// const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

dotenv.config();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const serviceAccount = require(process.env.SERVICE_ACCOUNT);

const app = express();
const PORT = process.env.PORT || 3000;



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const db = admin.firestore();

app.use(cors);

app.use(express.json());

// Endpoint para enviar una notificación a un usuario específico
app.post("/notificar", async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send(`Mensaje enviado correctamente: ${response}`);
  } catch (error) {
    res.status(500).send(`Error al enviar el mensaje: ${error}`);
  }
});

// Endpoint para enviar notificación a todos los empleados de un rol
app.post("/notificar-tipoEmpleado", async (req, res) => {
  const { title, body, role } = req.body;

  try {
    const employeeTokens = [];
    const querySnapshot = await db
      .collection("usuarios")
      .where("tipoEmpleado", "==", role)
      .get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        employeeTokens.push(data.token);
      }
    });

    if (employeeTokens.length === 0) {
      return res
        .status(404)
        .send("No hay empleados a los que enviar un mensaje");
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: employeeTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    res.status(200).send(`Mensajes enviados: ${response.successCount}`);
  } catch (error) {
    res.status(500).send(`Error al enviar mensaje: ${error}`);
  }
});

// Endpoint para enviar un mail a un usuario
app.post("/enviar-email", async (req, res) => {
  try {
    const { aceptacion, nombreUsuario, mail } = req.body;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD,
      },
    });

    let resultado = await transporter.sendMail({
      from: '"Sabores Únicos" <saboresunicospps@gmail.com>',
      to: mail,
      subject: aceptacion
        ? "Felicitaciones su cuenta fue aceptada"
        : "Disculpe pero hemos rechazado su cuenta.",
      html: `
<!DOCTYPE html>
<html style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8">
  <title>Sabores Únicos</title>
  <style type="text/css">
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
   .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
    }
   .content-box {
      width: 33%; /* Ajusta este valor según sea necesario */
      border: none; /* Elimina los bordes */
      box-shadow: 0 0 10px rgba(0,0,0,0); /* Opcional: Agrega sombra para dar profundidad */
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content-box">
      <div class="banner-container">
        <img class="banner-image" src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/images%2FBanner.png?alt=media&token=0d51d6cb-4891-4a44-8a7e-26dc6ed19f45" alt="Banner">
      </div>
      <div class="message-content">
        <!-- Contenido del mensaje aquí -->
        <h1>${aceptacion? "Felicitaciones " : "Disculpa "} ${nombreUsuario}</h1>
        <p>Su cuenta fue ${aceptacion? "aceptada" : "rechazada"}</p>
        ${aceptacion? "<p>Ya puede ingresar a la aplicación</p>" : ""}
        <br>
        <p>Saludos, el equipo de Sabores Únicos</p>
        <br>
        <img src="https://firebasestorage.googleapis.com/v0/b/ajg-pps-2024.appspot.com/o/Readme%2Fspinner.png?alt=media&token=a0e8799e-82bf-44e2-ac73-1db68f12c51e" alt="Sabores Únicos" width="150" height="150" ></img>

      </div>
</body>
</html>
      `,
    });
    res.json({ ...resultado, seEnvio: true });
  } catch (ex) {
    res.json({
      mensaje: `No se pudo enviar el mail. ${ex.message}` ,
      seEnvio: false,
    });
  }
});

// Exportar la instancia de Express como una función de Firebase
exports.app = functions.https.onRequest(app);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`End Points:`);
//   console.log(`- /notificar`);
//   console.log(`- /notificar-tipoEmpleado`);
//   console.log(`- /enviar-email`);

// });
