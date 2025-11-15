const { PrismaClient } = require("@prisma/client");
const express = require("express");

const prisma = new PrismaClient();
const app = express();

app.get("/beneficiarios", async (req, res) => {
  try {
    const beneficiarios = await prisma.paciente.findMany({
      orderBy: { id: "desc" },
    });

    res.json({
      data: beneficiarios,
      mensaje: "Beneficiarios obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener beneficiarios",
      error: error.message,
    });
  }
});

// Crear beneficiario
app.post("/beneficiarios", async (req, res) => {
  try {
    const beneficiario = await prisma.beneficiario.create({
      data: req.body,
    });

    res.status(201).json({
      data: beneficiario,
      mensaje: "Beneficiario creado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear beneficiario",
      error: error.message,
    });
  }
});

// ================================
// RUTAS EXPEDIENTES SOCIALES
// ================================

// Obtener todos los expedientes
app.get("/expedientes", async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          beneficiario: {
            OR: [
              { nombre: { contains: search, mode: "insensitive" } },
              { apellido: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {};

    const expedientes = await prisma.expedienteSocial.findMany({
      where: whereClause,
      include: {
        beneficiario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: { fechaActualizacion: "desc" },
    });

    const expedientesFormatted = expedientes.map((exp) => ({
      id: exp.id,
      beneficiario: `${exp.beneficiario.nombre} ${exp.beneficiario.apellido}`,
      composicionFamiliar: `${exp.composicionFamiliar} miembros`,
      ingresosFamiliares: `Bs ${exp.ingresosFamiliares}`,
      nivelVulnerabilidad: exp.nivelVulnerabilidad.toLowerCase(),
      fechaActualizacion: exp.fechaActualizacion.toISOString().split("T")[0],
      observaciones: exp.observacionesSocioeco || "Sin observaciones",
    }));

    res.json({
      data: expedientesFormatted,
      mensaje: "Expedientes obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener expedientes",
      error: error.message,
    });
  }
});

// Crear expediente
app.post("/expedientes", async (req, res) => {
  try {
    const {
      beneficiarioId,
      composicionFamiliar,
      ingresosFamiliares,
      condicionesVivienda,
      observacionesSocioeco,
      nivelVulnerabilidad,
    } = req.body;

    const expediente = await prisma.expedienteSocial.create({
      data: {
        beneficiarioId: parseInt(beneficiarioId),
        composicionFamiliar: parseInt(composicionFamiliar),
        ingresosFamiliares: parseFloat(ingresosFamiliares),
        condicionesVivienda,
        observacionesSocioeco,
        nivelVulnerabilidad: nivelVulnerabilidad?.toUpperCase() || "BAJO",
      },
      include: {
        beneficiario: true,
      },
    });

    res.status(201).json({
      data: expediente,
      mensaje: "Expediente creado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear expediente",
      error: error.message,
    });
  }
});

// Actualizar expediente
app.put("/expedientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expediente = await prisma.expedienteSocial.update({
      where: { id: parseInt(id) },
      data: {
        ...req.body,
        composicionFamiliar: req.body.composicionFamiliar
          ? parseInt(req.body.composicionFamiliar)
          : undefined,
        ingresosFamiliares: req.body.ingresosFamiliares
          ? parseFloat(req.body.ingresosFamiliares)
          : undefined,
        nivelVulnerabilidad: req.body.nivelVulnerabilidad?.toUpperCase(),
      },
      include: {
        beneficiario: true,
      },
    });

    res.json({
      data: expediente,
      mensaje: "Expediente actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar expediente",
      error: error.message,
    });
  }
});

// ================================
// RUTAS VISITAS
// ================================

// Obtener todas las visitas
app.get("/visitas", async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          beneficiario: {
            OR: [
              { nombre: { contains: search, mode: "insensitive" } },
              { apellido: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {};

    const visitas = await prisma.visita.findMany({
      where: whereClause,
      include: {
        beneficiario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // Formatear datos para el frontend
    const visitasFormatted = visitas.map((visita) => ({
      id: visita.id,
      beneficiario: `${visita.beneficiario.nombre} ${visita.beneficiario.apellido}`,
      fechaVisita: visita.fechaVisita.toISOString().split("T")[0],
      tipoVisita:
        visita.tipoVisita.charAt(0) + visita.tipoVisita.slice(1).toLowerCase(),
      objetivo: visita.objetivo,
      estado: visita.estado.toLowerCase(),
      observaciones: visita.observacionesEntorno || "Sin observaciones",
      proximaVisita: visita.proximaVisita
        ? visita.proximaVisita.toISOString().split("T")[0]
        : "No programada",
    }));

    res.json({
      data: visitasFormatted,
      mensaje: "Visitas obtenidas correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener visitas",
      error: error.message,
    });
  }
});

// Crear visita
app.post("/visitas", async (req, res) => {
  try {
    const {
      beneficiarioId,
      fechaVisita,
      tipoVisita,
      objetivo,
      observacionesEntorno,
      proximaVisita,
    } = req.body;

    const visita = await prisma.visita.create({
      data: {
        beneficiarioId: parseInt(beneficiarioId),
        fechaVisita: new Date(fechaVisita),
        tipoVisita: tipoVisita.toUpperCase(),
        objetivo,
        observacionesEntorno,
        proximaVisita: proximaVisita ? new Date(proximaVisita) : null,
      },
      include: {
        beneficiario: true,
      },
    });

    res.status(201).json({
      data: visita,
      mensaje: "Visita creada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear visita",
      error: error.message,
    });
  }
});

// ================================
// RUTAS EVALUACIÓN VULNERABILIDAD
// ================================

// Obtener evaluaciones de vulnerabilidad
app.get("/evaluaciones-vulnerabilidad", async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          beneficiario: {
            OR: [
              { nombre: { contains: search, mode: "insensitive" } },
              { apellido: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {};

    const evaluaciones = await prisma.evaluacionVulnerabilidad.findMany({
      where: whereClause,
      include: {
        beneficiario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: { fechaEvaluacion: "desc" },
    });

    // Formatear datos para el frontend
    const evaluacionesFormatted = evaluaciones.map((eval) => ({
      id: eval.id,
      beneficiario: `${eval.beneficiario.nombre} ${eval.beneficiario.apellido}`,
      puntajeTotal: eval.puntajeTotal,
      nivel: eval.nivel.toLowerCase(),
      fechaEvaluacion: eval.fechaEvaluacion.toISOString().split("T")[0],
      factoresRiesgo: eval.factoresRiesgo || "No especificados",
      recomendaciones: eval.recomendaciones || "Sin recomendaciones",
    }));

    res.json({
      data: evaluacionesFormatted,
      mensaje: "Evaluaciones obtenidas correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener evaluaciones",
      error: error.message,
    });
  }
});

// Crear evaluación de vulnerabilidad
app.post("/evaluaciones-vulnerabilidad", async (req, res) => {
  try {
    const {
      beneficiarioId,
      situacionEconomica,
      condicionesVivienda,
      saludFamiliar,
      educacionDesarrollo,
      factoresRiesgo,
      recomendaciones,
    } = req.body;

    // Calcular puntaje total y nivel
    const puntajeTotal =
      parseInt(situacionEconomica) +
      parseInt(condicionesVivienda) +
      parseInt(saludFamiliar) +
      parseInt(educacionDesarrollo);

    let nivel = "BAJO";
    if (puntajeTotal >= 70) nivel = "ALTO";
    else if (puntajeTotal >= 40) nivel = "MEDIO";

    const evaluacion = await prisma.evaluacionVulnerabilidad.create({
      data: {
        beneficiarioId: parseInt(beneficiarioId),
        situacionEconomica: parseInt(situacionEconomica),
        condicionesVivienda: parseInt(condicionesVivienda),
        saludFamiliar: parseInt(saludFamiliar),
        educacionDesarrollo: parseInt(educacionDesarrollo),
        puntajeTotal,
        nivel,
        factoresRiesgo,
        recomendaciones,
      },
      include: {
        beneficiario: true,
      },
    });

    res.status(201).json({
      data: evaluacion,
      mensaje: "Evaluación creada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear evaluación",
      error: error.message,
    });
  }
});

// ================================
// RUTAS DERIVACIONES Y PROFESIONALES
// ================================

// Obtener profesionales
app.get("/profesionales", async (req, res) => {
  try {
    const profesionales = await prisma.usuario.findMany({
      where: {
        rol: "voluntario",
      },
    });

    res.json({
      data: profesionales,
      mensaje: "Profesionales obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener profesionales",
      error: error.message,
    });
  }
});

// Obtener derivaciones
app.get("/derivaciones", async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          beneficiario: {
            OR: [
              { nombre: { contains: search, mode: "insensitive" } },
              { apellido: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {};

    const derivaciones = await prisma.derivacion.findMany({
      where: whereClause,
      include: {
        beneficiario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        profesionalDestino: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
      orderBy: { fechaCreacion: "desc" },
    });

    // Formatear datos para el frontend
    const derivacionesFormatted = derivaciones.map((der) => ({
      id: der.id,
      beneficiario: `${der.beneficiario.nombre} ${der.beneficiario.apellido}`,
      profesionalDestino: der.profesionalDestino.nombre,
      motivo: der.motivo,
      fechaDerivacion: der.fechaDerivacion.toISOString().split("T")[0],
      estado: der.estado.toLowerCase(),
      observaciones: der.observaciones || "Sin observaciones",
      fechaSeguimiento: der.fechaSeguimiento
        ? der.fechaSeguimiento.toISOString().split("T")[0]
        : "No programada",
    }));

    res.json({
      data: derivacionesFormatted,
      mensaje: "Derivaciones obtenidas correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener derivaciones",
      error: error.message,
    });
  }
});

// Crear derivación
app.post("/derivaciones", async (req, res) => {
  try {
    const {
      beneficiarioId,
      profesionalDestinoId,
      motivo,
      observaciones,
      fechaDerivacion,
      fechaSeguimiento,
    } = req.body;

    const derivacion = await prisma.derivacion.create({
      data: {
        beneficiarioId: parseInt(beneficiarioId),
        profesionalDestinoId: parseInt(profesionalDestinoId),
        motivo,
        observaciones,
        fechaDerivacion: fechaDerivacion
          ? new Date(fechaDerivacion)
          : new Date(),
        fechaSeguimiento: fechaSeguimiento ? new Date(fechaSeguimiento) : null,
      },
      include: {
        beneficiario: true,
        profesionalDestino: true,
      },
    });

    res.status(201).json({
      data: derivacion,
      mensaje: "Derivación creada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear derivación",
      error: error.message,
    });
  }
});

// Actualizar estado de derivación
app.put("/derivaciones/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const derivacion = await prisma.derivacion.update({
      where: { id: parseInt(id) },
      data: { estado: estado.toUpperCase() },
      include: {
        beneficiario: true,
        profesionalDestino: true,
      },
    });

    res.json({
      data: derivacion,
      mensaje: "Estado de derivación actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar derivación",
      error: error.message,
    });
  }
});
app.put("/visitas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      beneficiarioId,
      fechaVisita,
      tipoVisita,
      objetivo,
      observacionesEntorno,
      proximaVisita,
    } = req.body;

    const visita = await prisma.visita.update({
      where: { id: parseInt(id) },
      data: {
        beneficiarioId: beneficiarioId ? parseInt(beneficiarioId) : undefined,
        fechaVisita: fechaVisita ? new Date(fechaVisita) : undefined,
        tipoVisita: tipoVisita ? tipoVisita.toUpperCase() : undefined,
        objetivo,
        observacionesEntorno,
        proximaVisita: proximaVisita ? new Date(proximaVisita) : null,
      },
      include: {
        beneficiario: true,
      },
    });

    res.json({
      data: visita,
      mensaje: "Visita actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar visita",
      error: error.message,
    });
  }
});
app.put("/evaluaciones-vulnerabilidad/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      beneficiarioId,
      situacionEconomica,
      condicionesVivienda,
      saludFamiliar,
      educacionDesarrollo,
      factoresRiesgo,
      recomendaciones,
    } = req.body;

    // Calcular puntaje total y nivel
    const puntajeTotal =
      parseInt(situacionEconomica) +
      parseInt(condicionesVivienda) +
      parseInt(saludFamiliar) +
      parseInt(educacionDesarrollo);

    let nivel = "BAJO";
    if (puntajeTotal >= 70) nivel = "ALTO";
    else if (puntajeTotal >= 40) nivel = "MEDIO";

    const evaluacion = await prisma.evaluacionVulnerabilidad.update({
      where: { id: parseInt(id) },
      data: {
        beneficiarioId: beneficiarioId ? parseInt(beneficiarioId) : undefined,
        situacionEconomica: situacionEconomica
          ? parseInt(situacionEconomica)
          : undefined,
        condicionesVivienda: condicionesVivienda
          ? parseInt(condicionesVivienda)
          : undefined,
        saludFamiliar: saludFamiliar ? parseInt(saludFamiliar) : undefined,
        educacionDesarrollo: educacionDesarrollo
          ? parseInt(educacionDesarrollo)
          : undefined,
        puntajeTotal,
        nivel,
        factoresRiesgo,
        recomendaciones,
      },
      include: {
        beneficiario: true,
      },
    });

    res.json({
      data: evaluacion,
      mensaje: "Evaluación actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar evaluación",
      error: error.message,
    });
  }
});
app.put("/derivaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      beneficiarioId,
      profesionalDestinoId,
      motivo,
      observaciones,
      fechaDerivacion,
      fechaSeguimiento,
      estado,
    } = req.body;

    const derivacion = await prisma.derivacion.update({
      where: { id: parseInt(id) },
      data: {
        beneficiarioId: beneficiarioId ? parseInt(beneficiarioId) : undefined,
        profesionalDestinoId: profesionalDestinoId
          ? parseInt(profesionalDestinoId)
          : undefined,
        motivo,
        observaciones,
        fechaDerivacion: fechaDerivacion
          ? new Date(fechaDerivacion)
          : undefined,
        fechaSeguimiento: fechaSeguimiento
          ? new Date(fechaSeguimiento)
          : undefined,
        estado: estado ? estado.toUpperCase() : undefined,
      },
      include: {
        beneficiario: true,
        profesionalDestino: true,
      },
    });

    res.json({
      data: derivacion,
      mensaje: "Derivación actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar derivación",
      error: error.message,
    });
  }
});
module.exports = app;
