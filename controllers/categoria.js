const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = express();
const prisma = new PrismaClient();

app.get("/categoria", async (req, res) => {
  try {
    const categoria = await prisma.categoria.findMany({});
    res.json({
      data: categoria,
      mensaje: "categorias obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer categoria",
      error: error.mensaje,
    });
  }
});

app.get("/categoria/:id", async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: categoria,
      mensaje: "categoria obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer categoria",
      error: error.mensaje,
    });
  }
});
app.post("/categoria", async (req, res) => {
  try {
    const categoriaCreado = await prisma.categoria.create({
      data: req.body,
    });

    res.json({
      mensaje: "categoria creado correctamente",
      data: categoriaCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear categoria",
      error: error.mensaje,
    });
  }
});
app.put("/categoria/:id", async (req, res) => {
  try {
    const categoria = await prisma.categoria.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.json({
      mensaje: "categoria actualizado correcamente",
      data: categoria,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar categoria",
      error: error.mensaje,
    });
  }
});
app.delete("/categoria/:id", async (req, res) => {
  try {
    await prisma.categoria.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "categoria eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar categoria",
      error: error.mensaje,
    });
  }
});

module.exports = app;
