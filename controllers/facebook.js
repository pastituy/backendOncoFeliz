const axios = require("axios");
const express = require("express");
const router = express.Router();

class FacebookZapierController {
  constructor() {
    this.zapierWebhookURL =
      "https://hooks.zapier.com/hooks/catch/24344172/u8e71r4/";
  }

  async publishToFacebook(req, res) {
    try {
      const { title, message, imageUrl, link } = req.body;

      // Validar datos requeridos
      if (!message) {
        return res.status(400).json({
          success: false,
          error: "El mensaje es requerido",
        });
      }

      // Preparar los datos para enviar a Zapier
      const zapierData = {
        title: title || "",
        message: message,
        imageUrl: imageUrl || "",
        link: link || "",
        timestamp: new Date().toISOString(),
        source: "express-app",
      };

      // Enviar datos a Zapier
      const zapierResponse = await axios.post(
        this.zapierWebhookURL,
        zapierData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 segundos timeout
        }
      );

      // Respuesta exitosa
      return res.status(200).json({
        success: true,
        message: "Publicación enviada a Facebook exitosamente",
        zapierResponse: zapierResponse.data,
        data: zapierData,
      });
    } catch (error) {
      console.error("Error al publicar en Facebook via Zapier:", error);

      // Manejo específico de errores
      if (error.code === "ECONNABORTED") {
        return res.status(408).json({
          success: false,
          error: "Timeout: Zapier no respondió a tiempo",
        });
      }

      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          error: "Error en Zapier",
          details: error.response.data,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  }

  // Método para verificar la conexión con Zapier
  async testConnection(req, res) {
    try {
      const testData = {
        test: true,
        message: "Prueba de conexión desde Express",
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(this.zapierWebhookURL, testData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      return res.status(200).json({
        success: true,
        message: "Conexión con Zapier exitosa",
        response: response.data,
      });
    } catch (error) {
      console.error("Error al probar conexión con Zapier:", error);

      return res.status(500).json({
        success: false,
        error: "No se pudo conectar con Zapier",
        details: error.message,
      });
    }
  }

  // Método para publicaciones programadas
  async schedulePost(req, res) {
    try {
      const { title, message, imageUrl, link, scheduleDate } = req.body;

      if (!message || !scheduleDate) {
        return res.status(400).json({
          success: false,
          error: "Mensaje y fecha de programación son requeridos",
        });
      }

      const zapierData = {
        title: title || "",
        message: message,
        imageUrl: imageUrl || "",
        link: link || "",
        scheduleDate: scheduleDate,
        scheduled: true,
        timestamp: new Date().toISOString(),
        source: "express-app",
      };

      const zapierResponse = await axios.post(
        this.zapierWebhookURL,
        zapierData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Publicación programada enviada exitosamente",
        zapierResponse: zapierResponse.data,
        scheduledFor: scheduleDate,
      });
    } catch (error) {
      console.error("Error al programar publicación:", error);

      return res.status(500).json({
        success: false,
        error: "Error al programar publicación",
        details: error.message,
      });
    }
  }
}

// Crear una instancia de la clase
const facebookController = new FacebookZapierController();

// Definir las rutas con bind para mantener el contexto
router.post("/publish", facebookController.publishToFacebook.bind(facebookController));
router.get("/test", facebookController.testConnection.bind(facebookController));
router.post("/schedule", facebookController.schedulePost.bind(facebookController));

module.exports = router;