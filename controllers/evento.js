const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/evento", async (req, res) => {
  try {
    const evento = await prisma.evento.findMany({});
    res.json({
      data: evento,
      mensaje: "eventos obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer evento",
      error: error.mensaje,
    });
  }
});

app.get("/evento/:id", async (req, res) => {
  try {
    const evento = await prisma.evento.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: evento,
      mensaje: "evento obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer evento",
      error: error.mensaje,
    });
  }
});
app.post("/evento", async (req, res) => {
  try {
    const eventoCreado = await prisma.evento.create({
      data: req.body,
    });

    res.json({
      mensaje: "evento creado correctamente",
      data: eventoCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear evento",
      error: error.mensaje,
    });
  }
});
app.put("/evento/:id", async (req, res) => {
  try {
    const evento = await prisma.evento.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "evento actualizado correcamente",
      data: evento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar evento",
      error: error.mensaje,
    });
  }
});
app.delete("/evento/:id", async (req, res) => {
  try {
    await prisma.evento.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "evento eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar evento",
      error: error.mensaje,
    });
  }
});

module.exports = app;
