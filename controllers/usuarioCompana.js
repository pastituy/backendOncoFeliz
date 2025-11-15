const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/usuarioCam", async (req, res) => {
  try {
    const usuarioCompana = await prisma.usuarioCompana.findMany({});
    res.json({
      data: usuarioCompana,
      mensaje: "Usuarios obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer Usuario",
      error: error.mensaje,
    });
  }
});

app.get("/usuarioCam/:id", async (req, res) => {
  try {
    const usuarioCompana = await prisma.usuarioCompana.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: usuarioCompana,
      mensaje: "Usuario obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer Usuario",
      error: error.mensaje,
    });
  }
});
app.post("/usuarioCam", async (req, res) => {
  try {
    const usuarioCompanaCreado = await prisma.usuarioCompana.create({
      data: req.body,
    });

    res.json({
      mensaje: "Usuario creado correctamente",
      data: usuarioCompanaCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear Usuario",
      error: error.mensaje,
    });
  }
});
app.put("/usuarioCam/:id", async (req, res) => {
  try {
    const usuarioCompana = await prisma.usuarioCompana.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "Usuario actualizado correcamente",
      data: usuarioCompana,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar Usuario",
      error: error.mensaje,
    });
  }
});
app.delete("/usuarioCam/:id", async (req, res) => {
  try {
    await prisma.usuarioCompana.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "usuarioCompana eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar Usuario",
      error: error.mensaje,
    });
  }
});

module.exports = app;
