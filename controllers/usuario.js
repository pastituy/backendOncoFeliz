const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/usuario", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({});
    res.json({
      data: usuarios,
      mensaje: "Usuario obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer usuarios",
      error: error.mensaje,
    });
  }
});

app.get("/usuario/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: usuario,
      mensaje: "Usuario obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer usuarios",
      error: error.mensaje,
    });
  }
});
app.post("/usuario", async (req, res) => {
  try {
    const { nombre, email, telefono, pais, ci, rol, password } = req.body;
    const ROUNDS = 10;
    const salt = bcrypt.genSaltSync(ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (
      (nombre === "" || email === "" || telefono === "" || pais === "",
      ci === "",
      rol === "")
    ) {
      res.json({
        mensaje: "Estos campos son obligatorios",
      });
      return;
    }
    const correoValidador = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    if (!email || !correoValidador.test(email)) {
      res.json({
        mensaje: "El correo es obligatorio y tiene un formato",
      });
      return;
    }
    const usuarioExist = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
    if (usuarioExist)
      return res.json({
        mensaje: "El correo ya existe",
        status: 400,
      });

    const usuarioCreado = await prisma.usuario.create({
      data: {
        nombre,
        email,
        telefono,
        pais,
        ci,
        rol,
        password: hashedPassword,
      },
    });

    res.json({
      mensaje: "Usuario creado correctamente",
      data: usuarioCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear usuario",
      error: error.mensaje,
    });
  }
});
app.put("/usuario/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "Usuario actualizado correctamente",
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar usuario",
      error: error.mensaje,
    });
  }
});
app.delete("/usuario/:id", async (req, res) => {
  try {
    await prisma.usuario.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.mensaje,
    });
  }
});

module.exports = app;
