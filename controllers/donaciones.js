const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();

app.get("/donaciones", async (req, res) => {
  try {
    const donaciones = await prisma.donaciones.findMany({});
    res.json({
      data: donaciones,
      mensaje: "donaciones obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer donaciones",
      error: error.mensaje,
    });
  }
});

app.get("/donaciones/:id", async (req, res) => {
  try {
    const donaciones = await prisma.donaciones.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: donaciones,
      mensaje: "donaciones obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer donaciones",
      error: error.mensaje,
    });
  }
});
app.post("/donaciones", async (req, res) => {
  try {
    const donacionesCreado = await prisma.donaciones.create({
      data: req.body,
    });

    res.json({
      mensaje: "donaciones creado correctamente",
      data: donacionesCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear donaciones",
      error: error.mensaje,
    });
  }
});
app.put("/donaciones/:id", async (req, res) => {
  try {
    const donaciones = await prisma.donaciones.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "donaciones actualizado correcamente",
      data: donaciones,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar donaciones",
      error: error.mensaje,
    });
  }
});
app.delete("/donaciones/:id", async (req, res) => {
  try {
    await prisma.donaciones.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "donaciones eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar donaciones",
      error: error.mensaje,
    });
  }
});

module.exports = app;
