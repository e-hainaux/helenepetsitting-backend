const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const verifyRecaptcha = require("./verifyRecaptcha.js"); // Ajout de l'import pour verifyRecaptcha
require("dotenv").config();

// Fonction pour envoyer un email
const sendEmail = async (options) => {
  try {
    // Créer un transporteur SMTP réutilisable
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envoyer l'e-mail
    await transporter.sendMail(options);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

// Route pour envoyer un email
router.post("/send-email", async (req, res) => {
  const { token, prenom, nom, email, telephone, commentaire } = req.body;

  // **Vérification du token reCAPTCHA**
  const isTokenValid = await verifyRecaptcha(token);

  if (isTokenValid) {
    // Le token est valide, traiter le formulaire

    // Définir les options de l'e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "HELENE PET SITTING - Nouvelle demande de contact",
      html: `<p>Nom: ${prenom} ${nom}</p>
      <p>Email: ${email}</p>
      <p>Téléphone: ${telephone}</p>
      <p>Commentaire: ${commentaire}</p>`,
    };

    // Envoyer l'e-mail
    try {
      await sendEmail(mailOptions);
      res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
    }
  } else {
    //   Le token est invalide, afficher une erreur
    res.status(401).json({ error: "Le reCAPTCHA n'est pas valide." });
  }
});

module.exports = router;
