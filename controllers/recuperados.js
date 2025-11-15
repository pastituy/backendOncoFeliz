const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const app = express();

app.get("/recuperados", async (req, res) => {
  try {
    const recuperados = await prisma.recuperados.findMany({
      include: {
        paciente: true,
      },
    });

    const formattedData = recuperados.map((recuperado) => ({
      id: recuperado.id,
      name: `${recuperado.paciente.nombre} ${recuperado.paciente.apellido}`,
      age: `${recuperado.paciente.edad} años`,
      diagnosis: recuperado.diagnosis,
      image: recuperado.image,
      quote: recuperado.quote,
      recovered: recuperado.recovered,
      idPaciente:recuperado.idPaciente,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error al obtener casos recuperados:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los casos de recuperación" });
  }
});

app.get("/recuperados/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const recuperado = await prisma.recuperados.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        paciente: true,
      },
    });

    if (!recuperado) {
      return res
        .status(404)
        .json({ error: "Caso de recuperación no encontrado" });
    }

    const formattedData = {
      id: recuperado.id,
      name: `${recuperado.paciente.nombre} ${recuperado.paciente.apellido}`,
      age: `${recuperado.paciente.edad} años`,
      diagnosis: recuperado.diagnosis,
      image: recuperado.image,
      quote: recuperado.quote,
      recovered: recuperado.recovered,
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error al obtener caso recuperado:", error);
    res.status(500).json({ error: "Error al obtener el caso de recuperación" });
  }
});

app.post("/recuperados", async (req, res) => {
  const { idPaciente, diagnosis, image, quote, recovered } = req.body;

  try {
    const existeRecuperado = await prisma.recuperados.findFirst({
      where: {
        idPaciente: Number(idPaciente),
      },
    });

    if (existeRecuperado) {
      return res.status(400).json({
        error: "Ya existe un caso de recuperación para este paciente",
      });
    }

    const pacienteExiste = await prisma.paciente.findFirst({
      where: {
        id: Number(idPaciente),
      },
    });

    if (!pacienteExiste) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const nuevoRecuperado = await prisma.recuperados.create({
      data: {
        idPaciente: Number(idPaciente),
        diagnosis,
        image,
        quote,
        recovered,
      },
      include: {
        paciente: true,
      },
    });

    const formattedData = {
      id: nuevoRecuperado.id,
      name: `${nuevoRecuperado.paciente.nombre} ${nuevoRecuperado.paciente.apellido}`,
      age: `${nuevoRecuperado.paciente.edad} años`,
      diagnosis: nuevoRecuperado.diagnosis,
      image: nuevoRecuperado.image,
      quote: nuevoRecuperado.quote,
      recovered: nuevoRecuperado.recovered,
    };

    res.status(201).json(formattedData);
  } catch (error) {
    console.error("Error al crear caso recuperado:", error);
    res.status(500).json({ error: "Error al crear el caso de recuperación" });
  }
});

app.put("/recuperados/:id", async (req, res) => {
  const { id } = req.params;
  const { diagnosis, image, quote, recovered } = req.body;

  try {
    const recuperadoActualizado = await prisma.recuperados.update({
      where: {
        id: Number(id),
      },
      data: {
        diagnosis,
        image,
        quote,
        recovered,
      },
      include: {
        paciente: true,
      },
    });

    const formattedData = {
      id: recuperadoActualizado.id,
      name: `${recuperadoActualizado.paciente.nombre} ${recuperadoActualizado.paciente.apellido}`,
      age: `${recuperadoActualizado.paciente.edad} años`,
      diagnosis: recuperadoActualizado.diagnosis,
      image: recuperadoActualizado.image,
      quote: recuperadoActualizado.quote,
      recovered: recuperadoActualizado.recovered,
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error al actualizar caso recuperado:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el caso de recuperación" });
  }
});

app.get("/recuperados/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.recuperados.delete({
      where: {
        id: Number(id),
      },
    });

    res
      .status(200)
      .json({ message: "Caso de recuperación eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar caso recuperado:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el caso de recuperación" });
  }
});

exports.getRecuperadoByPacienteId = async (req, res) => {
  const { idPaciente } = req.params;

  try {
    const recuperado = await prisma.recuperados.findUnique({
      where: {
        idPaciente: Number(idPaciente),
      },
      include: {
        paciente: true,
      },
    });

    if (!recuperado) {
      return res.status(404).json({
        error: "Caso de recuperación no encontrado para este paciente",
      });
    }

    const formattedData = {
      id: recuperado.id,
      name: `${recuperado.paciente.nombre} ${recuperado.paciente.apellido}`,
      age: `${recuperado.paciente.edad} años`,
      diagnosis: recuperado.diagnosis,
      image: recuperado.image,
      quote: recuperado.quote,
      recovered: recuperado.recovered,
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error al obtener caso recuperado:", error);
    res.status(500).json({ error: "Error al obtener el caso de recuperación" });
  }
};
app.delete("/recuperados/:id", async (req, res) => {
  try {
    await prisma.recuperados.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      mensaje: "recuperado eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar recuperado",
      error: error.mensaje,
    });
  }
});
module.exports = app;