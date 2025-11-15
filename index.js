const express = require("express");
const cors = require("cors");
const Usuario = require("./controllers/usuario");
const Donaciones = require("./controllers/donaciones");
const Evento = require("./controllers/evento");
const Paciente = require("./controllers/paciente");
const Padre = require("./controllers/padre");
const Tratamiento = require("./controllers/tratamiento");
const blog = require("./controllers/blog");
const campana = require("./controllers/campana");
const categoria = require("./controllers/categoria");
const comentarios = require("./controllers/comentarios");
const respuesta = require("./controllers/respuesta");
const usuarioCompana = require("./controllers/usuarioCompana");
const login = require("./controllers/login");
const recuperados = require("./controllers/recuperados");
const facebook = require("./controllers/facebook");
const psicologo = require("./controllers/psicologo");
const TrabajoSocial = require("./controllers/trabajdoraSocial");
const facebookRoutes = require("./controllers/facebook");
const gastoMedico = require("./controllers/gastoMedico");
const mobile_login = require("./controllers/app/login");
const mobile_data = require("./controllers/app/data_pacientes");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "API Facebook-Zapier funcionando",
    endpoints: {
      "POST /api/facebook/publish": "Publicar en Facebook",
      "GET /api/facebook/test": "Probar conexión",
      "POST /api/facebook/schedule": "Programar publicación",
    },
  });
});
app.use("/api/facebook", facebookRoutes);
app.use(facebook);
app.use(Usuario);
app.use(Donaciones);
app.use(Evento);
app.use(Paciente);
app.use(Padre);
app.use(Tratamiento);
app.use(blog);
app.use(campana);
app.use(categoria);
app.use(comentarios);
app.use(respuesta);
app.use(psicologo);
app.use(TrabajoSocial);
app.use(usuarioCompana);
app.use(recuperados);
app.use(mobile_login);
app.use(mobile_data);
app.use(login);
app.use(gastoMedico);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
});

app.listen(3000, () =>
  console.log("Servidor corriendo en http://localhost:3000")
);
