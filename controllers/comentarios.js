const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/comentarios", async (req, res) => {
  try {
    const comentarios = await prisma.comentarios.findMany({});
    res.json({
      data: comentarios,
      mensaje: "comentarios obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer comentarios",
      error: error.mensaje,
    });
  }
});

app.get("/comentarios/:id", async (req, res) => {
  try {
    const comentarios = await prisma.comentarios.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: comentarios,
      mensaje: "comentarios obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer comentarios",
      error: error.mensaje,
    });
  }
});
app.post("/comentarios", async (req, res) => {
  try {
    const comentariosCreado = await prisma.comentarios.create({
      data: req.body,
    });

    res.json({
      mensaje: "comentarios creado correctamente",
      data: comentariosCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear comentarios",
      error: error.mensaje,
    });
  }
});
app.put("/comentarios/:id", async (req, res) => {
  try {
    const comentarios = await prisma.comentarios.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "comentarios actualizado correcamente",
      data: comentarios,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar comentarios",
      error: error.mensaje,
    });
  }
});
app.delete("/comentarios/:id", async (req, res) => {
  try {
    await prisma.comentarios.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "comentarios eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar comentarios",
      error: error.mensaje,
    });
  }
});

module.exports = app;
