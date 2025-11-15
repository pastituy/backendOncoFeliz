const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();

app.get("/tratamiento", async (req, res) => {
  try {
   const tratamiento = await prisma.tratamiento.findMany({
  include: {
    paciente: {
      select: {
        nombre: true,
        padre: {
          select: {
            telefono: true
          }
        }
      }
    }
  }
});

    

    res.json({
      data: tratamiento,
      mensaje: "Tratamientos obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer tratamiento",
      error: error.message,
    });
  }
});


app.get("/tratamiento/:id", async (req, res) => {
  try {
    const tratamiento = await prisma.tratamiento.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: tratamiento,
      mensaje: "tratamiento obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer tratamiento",
      error: error.mensaje,
    });
  }
});
app.post("/tratamiento", async (req, res) => {
  try {
    const { tipoTratamiento, descripcion, idPaciente, estado, fecha, siguienteCita } = req.body;

    const tratamiento = await prisma.tratamiento.create({
      data: {
        tipoTratamiento,
        descripcion,
        idPaciente:Number(idPaciente),
        estado,
        fecha: new Date(fecha), 
        siguienteCita: new Date(siguienteCita), 
      },
    });

    res.json({
      mensaje: "Tratamiento agregado correctamente",
      data: tratamiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar tratamiento",
      error: error.message,
    });
  }
});

app.put("/tratamiento/:id", async (req, res) => {
  try {
    const { tipoTratamiento, descripcion, idPaciente, estado, fecha, siguienteCita } = req.body;

    const tratamiento = await prisma.tratamiento.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        tipoTratamiento,
        descripcion,
        idPaciente,
        estado,
        fecha: new Date(fecha), 
        siguienteCita: new Date(siguienteCita),
      },
    });

    res.json({
      mensaje: "Tratamiento actualizado correctamente",
      data: tratamiento,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar tratamiento",
      error: error.message,
    });
  }
});

app.delete("/tratamiento/:id", async (req, res) => {
  try {
    await prisma.tratamiento.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "tratamiento eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar tratamiento",
      error: error.mensaje,
    });
  }
});

module.exports = app;
