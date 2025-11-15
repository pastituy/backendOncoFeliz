const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();

app.get("/gastoMedico", async (req, res) => {
  try {
    const gastoMedico = await prisma.gastoMedico.findMany({
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    });
    
    // Formatear los datos para el frontend
    const gastosFormateados = gastoMedico.map(gasto => ({
      id: gasto.id,
      pacienteId: gasto.pacienteId,
      pacienteNombre: `${gasto.paciente.nombre} ${gasto.paciente.apellido}`,
      concepto: gasto.concepto,
      // Para mostrar en la tabla (formateado)
      montoTotal: `Bs ${parseFloat(gasto.montoTotal).toFixed(2)}`,
      montoCubierto: `Bs ${parseFloat(gasto.montoCubierto).toFixed(2)}`,
      montoFamilia: `Bs ${parseFloat(gasto.montoFamilia).toFixed(2)}`,
      montoPendiente: `Bs ${(parseFloat(gasto.montoTotal) - parseFloat(gasto.montoCubierto) - parseFloat(gasto.montoFamilia)).toFixed(2)}`,
      fecha: new Date(gasto.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      observaciones: gasto.observaciones,
      // Para editar (valores originales sin formato)
      montoTotalOriginal: parseFloat(gasto.montoTotal),
      montoCubiertoOriginal: parseFloat(gasto.montoCubierto),
      montoFamiliaOriginal: parseFloat(gasto.montoFamilia)
    }));
    
    res.json({
      data: gastosFormateados,
      mensaje: "Gasto medicos obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer gastoMedico",
      error: error.message,
    });
  }
});

app.get("/gastoMedico/:id", async (req, res) => {
  try {
    const gastoMedico = await prisma.gastoMedico.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      data: gastoMedico,
      mensaje: "Gasto medicos obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al traer Gasto medicos",
      error: error.mensaje,
    });
  }
});
app.post("/gastoMedico", async (req, res) => {
  try {
    const data = {
      ...req.body,
      pacienteId: parseInt(req.body.pacienteId),
      montoTotal: parseFloat(req.body.montoTotal),
      montoCubierto: parseFloat(req.body.montoCubierto) || 0,
      montoFamilia: parseFloat(req.body.montoFamilia) || 0,
    };

    const gastoMedicoCreado = await prisma.gastoMedico.create({
      data: data,
    });

    res.json({
      mensaje: "Gasto medicos creado correctamente",
      data: gastoMedicoCreado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear gastoMedico",
      error: error.message,
    });
  }
});
app.put("/gastoMedico/:id", async (req, res) => {
  try {
    // Convertir strings a números antes de actualizar
    const data = {
      ...req.body,
      pacienteId: parseInt(req.body.pacienteId),
      montoTotal: parseFloat(req.body.montoTotal),
      montoCubierto: parseFloat(req.body.montoCubierto) || 0,
      montoFamilia: parseFloat(req.body.montoFamilia) || 0,
    };

    const gastoMedico = await prisma.gastoMedico.update({
      where: {
        id: Number(req.params.id),
      },
      data: data,
    });
    
    res.json({
      mensaje: "Gasto medicos actualizado correctamente",
      data: gastoMedico,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar gastoMedico",
      error: error.message, // Cambié "mensaje" por "message"
    });
  }
});
app.delete("/gastoMedico/:id", async (req, res) => {
  try {
    await prisma.gastoMedico.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "Gasto medicos eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar gastoMedico",
      error: error.mensaje,
    });
  }
});

module.exports = app;
