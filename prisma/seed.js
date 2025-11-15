const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  //Usuario
  const users = [
    {
      nombre: "Celso del Romero",
      email: "marinosaez@gmail.com",
      telefono: "+591  72240557",
      pais: "Bolivia",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ci: "2137185",
      rol: "voluntario",
    },
    {
      nombre: "Calisto Palma Hernández",
      email: "rodenasmarianela@gmail.com",
      telefono: "+591 68540855",
      pais: "Bolivia",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ci: "3207201",
      rol: "donante",
    },
    {
      nombre: "Jhoselin cespedez",
      email: "jhoselin@gmail.com",
      telefono: "+591 68548252",
      pais: "Bolivia",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ci: "3207201",
      rol: "admin",
    },
  ];
  for (const user of users) {
    await prisma.usuario.create({ data: user });
  }

  // Semilla de donaciones
  const donaciones = [
    {
      nombreDonante: "María López",
      cantidad: "500",
      metodoPago: "Transferencia",
      descripcion: "Apoyo para tratamientos médicos de niños con cáncer",
      fecha: new Date("2025-03-15T10:30:00"),
    },
    {
      nombreDonante: "Carlos Pérez",
      cantidad: "750",
      metodoPago: "QR",
      descripcion: "Donación para la campaña 'Caminando por la Vida'",
      fecha: new Date("2025-04-10T14:45:00"),
    },
    {
      nombreDonante: "Ana Gómez",
      cantidad: "300",
      metodoPago: "TARJETA",
      descripcion: "Contribución para la compra de medicamentos oncológicos",
      fecha: new Date("2025-05-05T09:15:00"),
    },
    {
      nombreDonante: "Luis Torres",
      cantidad: "100",
      metodoPago: "QR",
      descripcion: "Donación solidaria",
    },
    { nombreDonante: "Pedro Jiménez", cantidad: "150", metodoPago: "Efectivo" },
  ];
  for (const donacion of donaciones) {
    await prisma.donaciones.create({ data: donacion });
  }

  // Semilla de padres y pacientes
  const padres = [
    {
      nombre: "Sebastian",
      apellido: "Lopez",
      telefono: "+591 72240555",
      ci: "4575845",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ubicacion: "Av.America entre libertador",
    },
    {
      nombre: "Martin",
      apellido: "Florez",
      telefono: "+591 72258545",
      ci: "4568587",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",

      ubicacion: "Av.San martin entre punata",
    },
    {
      nombre: "Mario",
      apellido: "Calle",
      telefono: "+591 65854785",
      ci: "584758",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",

      ubicacion: "Av.petrolera km 2",
    },
    {
      nombre: "Fernadno",
      apellido: "Quizpe",
      telefono: "+591 78585485",
      ci: "5854785",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ubicacion: "Av.quillacollo km ",
    },
    {
      nombre: "Alex",
      apellido: "cueto",
      telefono: "+591 69698585",
      ci: "2547856",
      password: "$2b$10$XpXYAQrdi7zGdhbLUKcBYeMhhUnFj1qM.vJXPm8K6wUEa03xYrYxW",
      ubicacion: "Av.Sacaba km 3",
    },
  ];
  const pacientes = [
    {
      nombre: "Lucas",
      apellido: "Lopez",
      ciudad: "Cochabamba",
      tipoCancer: "Leucemia",
      edad: 8,
      idPadre: 1,
    },
    {
      nombre: "Valeria",
      apellido: "Mamani",
      ciudad: "La Paz",
      tipoCancer: "Linfoma",
      edad: 10,
      idPadre: 2,
    },
    {
      nombre: "Mateo",
      apellido: "Fernandez",
      ciudad: "Santa Cruz",
      tipoCancer: "Neuroblastoma",
      edad: 6,
      idPadre: 3,
    },
    {
      nombre: "Camila",
      apellido: "Lopez",
      ciudad: "Cochabamba",
      tipoCancer: "Sarcoma",
      edad: 7,
      idPadre: 4,
    },
    {
      nombre: "Andrea",
      apellido: "Fernandez",
      ciudad: "Santa Cruz",
      tipoCancer: "Tumor de Wilms",
      edad: 9,
      idPadre: 5,
    },
  ];
  for (const padre of padres) {
    await prisma.padre.create({ data: padre });
  }
  for (const paciente of pacientes) {
    await prisma.paciente.create({ data: paciente });
  }

  //Semilla de recuperados
  const recuperados = [
    {
      idPaciente: 1,
      diagnosis: "Leucemia linfoblástica aguda",
      image: "https://source.unsplash.com/300x300/?boy,portrait",
      quote:
        "Gracias a los tratamientos y al apoyo de la fundación, hoy Carlos puede volver a jugar fútbol con sus amigos. Su familia nos cuenta que su sonrisa ha vuelto más brillante que nunca.",
      recovered: "Abril 2025",
    },
    {
      idPaciente: 2,
      diagnosis: "Tumor cerebral",
      image: "https://source.unsplash.com/300x300/?boy,portrait",
      quote:
        "Después de una difícil batalla de dos años, Sofía finalmente está libre de cáncer. Su determinación y valentía han sido una inspiración para todos en la fundación.",
      recovered: "Marzo 2025",
    },
    {
      idPaciente: 3,
      diagnosis: "Linfoma de Hodgkin",
      image: "https://source.unsplash.com/300x300/?boy,portrait",
      quote:
        "Miguel ha demostrado una fuerza increíble durante su tratamiento. Hoy celebramos su recuperación y nos alegra verlo disfrutar nuevamente de sus clases de pintura.",
      recovered: "Enero 2025",
    },
  ];
  for (const recuperado of recuperados) {
    await prisma.recuperados.create({ data: recuperado });
  }

  //Semilla tratamiento
  const tratamientos = [
    {
      tipoTratamiento: "Quimioterapia",
      descripcion: "Primera fase de quimio",
      idPaciente: 1,
      estado: true,
      siguienteCita: "2025-05-30T10:00:00Z",
    },
    {
      tipoTratamiento: "Radioterapia",
      descripcion: "Sesiones semanales",
      idPaciente: 2,
      estado: false,
      siguienteCita: "2025-06-15T09:00:00Z",
    },
    {
      tipoTratamiento: "Medicación",
      descripcion: "Control mensual",
      idPaciente: 3,
      estado: true,
      siguienteCita: "2025-06-01T14:00:00Z",
    },
  ];
  for (const tratamiento of tratamientos) {
    await prisma.tratamiento.create({ data: tratamiento });
  }

  // Semilla de categorías
  const categorias = [
    { nombre: "proceso niños" },
    { nombre: "recuperacion niños" },
    { nombre: "informacion basica" },
    { nombre: "casos de niños" },
    { nombre: "noticias" },
  ];
  for (const categoria of categorias) {
    await prisma.categoria.create({ data: categoria });
  }

  // Semilla de eventos
  const eventos = [
    {
      titulo: "Festival por la Vida",
      descripcion: "Evento de recaudación",
      fecha: "2025-06-01",
      ubicacion: "Parque Urbano",
    },
    {
      titulo: "Caminata Solidaria",
      descripcion: "Apoyemos caminando",
      fecha: "2025-06-15",
      ubicacion: "La Recoleta",
    },
    {
      titulo: "Tarde de Juegos",
      descripcion: "Diversión para niños",
      fecha: "2025-07-10",
      ubicacion: "Cancha Municipal",
    },
  ];
  for (const evento of eventos) {
    await prisma.evento.create({ data: evento });
  }

  // Semilla de campañas
  const campanas = [
    {
      titulo: "Apoyo Psicológico para Familias",
      descripcion:
        "Financiamos terapias para las familias de niños con cáncer, un aspecto crucial en la lucha contra la enfermedad.",
      fecha: "2025-07-29",
      multimedia:
        "https://tse4.mm.bing.net/th/id/OIP.yurl0toJO4VBQpanOfkbogHaE7?rs=1&pid=ImgDetMain",
      recaudado: 800.5,
      previstro: 1000,
    },
    {
      titulo: "Para tener muchas cosas",
      descripcion:
        "Esto respaldara todo lo que se esta haciendo, las camas los medicamentos, camara elasticas y eso",
      fecha: "2025-07-25",
      multimedia:
        "https://th.bing.com/th/id/OIP.lPKHs2MjWBeRV6d6yH6FRwHaFj?w=230&h=180&c=7&pcl=292827&r=0&o=5&dpr=1.3&pid=1.7",
      recaudado: 450.75,
      previstro: 700,
    },
    {
      titulo: "Equipamiento para Sala de Oncología Pediátrica",
      descripcion:
        "Ayúdanos a equipar la nueva sala de oncología pediátrica con equipos modernos que mejorarán diagnósticos y tratamientos.",
      fecha: "2025-08-29",
      multimedia:
        "https://d328k6xhl3lmif.cloudfront.net/images/default-source/default-album/20230105_084539.jpg?sfvrsn=e58a1186_0",
      recaudado: 1200,
      previstro: 1500,
    },
  ];
  for (const campana of campanas) {
    await prisma.campana.create({ data: campana });
  }

  // Semilla de blogs
  const blogs = [
    {
      titulo: "Cómo ayudar a niños con cáncer",
      excerpt: "Descubre cómo puedes ayudar",
      autor: "Carlos Pérez",
      imagen:
        "https://th.bing.com/th/id/OIP.5Dhj27jszB9p99zSuyiTigHaFt?rs=1&pid=ImgDetMain",
      idCategoria: 5,
    },
    {
      titulo: "Historias de esperanza",
      excerpt: "Niños que vencieron",
      autor: "Ana Gómez",
      imagen:
        "https://th.bing.com/th/id/R.3388e62f0769c276671ad41c2c778de4?rik=PvNUX169N7vP6w&pid=ImgRaw&r=0",
      idCategoria: 5,
    },
    {
      titulo: "Información útil para padres",
      excerpt: "Lo que debes saber",
      autor: "María Ruiz",
      imagen:
        "https://th.bing.com/th/id/OIP.h9l5WSUx1n_W6B_pgnJX3wHaF1?rs=1&pid=ImgDetMain",
      idCategoria: 5,
    },
  ];
  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }

  //Semilla de contenido
  const contenidos = [
    {
      titulo: "Introducción",
      texto:
        "Ayudar a niños con cáncer puede parecer difícil, pero en realidad hay muchas maneras en las que cualquier persona puede contribuir. Desde donar sangre o médula ósea, hasta ofrecer apoyo emocional a las familias o participar en campañas de concientización. Este blog está diseñado para orientarte sobre cómo puedes marcar la diferencia, incluso con acciones pequeñas.",
      orden: 1,
      blogId: 1,
    },
    {
      titulo: "Historias reales",
      texto:
        "Valeria, una niña de solo 7 años, fue diagnosticada con leucemia. Gracias al tratamiento oportuno, el apoyo incondicional de su familia y la solidaridad de muchas personas que donaron, hoy está libre de cáncer. Historias como la de Valeria nos recuerdan que detrás de cada diagnóstico hay esperanza, lucha y muchas razones para seguir ayudando.",
      orden: 1,
      blogId: 2,
    },
    {
      titulo: "Consejos prácticos",
      texto:
        "Cuando un hijo es diagnosticado con cáncer, es normal sentirse perdido. Hablar con tu médico y con el equipo de atención es fundamental. Toma nota de los tratamientos, pregunta todo lo que necesites y no dudes en buscar una segunda opinión. También es importante mantener una red de apoyo emocional, tanto para el niño como para los padres.",
      orden: 1,
      blogId: 3,
    },
  ];
  for (const contenido of contenidos) {
    await prisma.contenido.create({ data: contenido });
  }

  //Semilla de tag
  const tags = [
    { nombre: "ayuda" },
    { nombre: "esperanza" },
    { nombre: "información" },
  ];
  for (const tag of tags) {
    await prisma.tag.create({ data: tag });
  }

  //Semilla de comentarios
  const comentarios = [
    { comentario: "Muy útil, gracias", idBlog: 1 },
    { comentario: "Hermosa historia", idBlog: 2 },
    { comentario: "Me ayudó bastante", idBlog: 3 },
  ];
  for (const comentario of comentarios) {
    await prisma.comentarios.create({ data: comentario });
  }

  //Semilla de respuestas
  const respuestas = [
    { respuesta: "¡Gracias por leer!", idComentario: 1 },
    { respuesta: "Nos alegra que te inspire", idComentario: 2 },
    { respuesta: "Estamos para ayudar", idComentario: 3 },
  ];
  for (const respuesta of respuestas) {
    await prisma.respuesta.create({ data: respuesta });
  }
  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
