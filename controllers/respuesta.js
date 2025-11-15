const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/respuesta", async (req, res) => {
  try {
    const respuesta = await prisma.respuesta.findMany({});
    res.json({
      data: respuesta,
      mensaje: "respuestas obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer respuesta",
      error: error.mensaje,
    });
  }
});

app.get("/respuesta/:id", async (req, res) => {
  try {
    const respuesta = await prisma.respuesta.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: respuesta,
      mensaje: "respuesta obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer respuesta",
      error: error.mensaje,
    });
  }
});
app.post("/respuesta", async (req, res) => {
  try {
    const respuestaCreado = await prisma.respuesta.create({
      data: req.body,
    });

    res.json({
      mensaje: "respuesta creado correctamente",
      data: respuestaCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear respuesta",
      error: error.mensaje,
    });
  }
});
app.put("/respuesta/:id", async (req, res) => {
  try {
    const respuesta = await prisma.respuesta.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "respuesta actualizado correcamente",
      data: respuesta,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar respuesta",
      error: error.mensaje,
    });
  }
});
app.delete("/respuesta/:id", async (req, res) => {
  try {
    await prisma.respuesta.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "respuesta eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar respuesta",
      error: error.mensaje,
    });
  }
});

module.exports = app;
