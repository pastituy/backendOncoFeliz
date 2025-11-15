const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/campana", async (req, res) => {
  try {
    const campana = await prisma.campana.findMany({});
    res.json({
      data: campana,
      mensaje: "campanas obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer campana",
      error: error.mensaje,
    });
  }
});

app.get("/campana/:id", async (req, res) => {
  try {
    const campana = await prisma.campana.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: campana,
      mensaje: "campana obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer campana",
      error: error.mensaje,
    });
  }
});
app.post("/campana", async (req, res) => {
  try {
    const campanaCreado = await prisma.campana.create({
      data: req.body,
    });

    res.json({
      mensaje: "campana creado correctamente",
      data: campanaCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear campana",
      error: error.mensaje,
    });
  }
});
app.put("/campana/:id", async (req, res) => {
  try {
    const campana = await prisma.campana.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "campana actualizado correcamente",
      data: campana,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar campana",
      error: error.mensaje,
    });
  }
});
app.delete("/campana/:id", async (req, res) => {
  try {
    await prisma.campana.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "campana eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar campana",
      error: error.mensaje,
    });
  }
});

module.exports = app;
