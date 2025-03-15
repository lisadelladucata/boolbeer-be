const db = require("../config/db");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Carica le variabili d'ambiente

// Configura il trasportatore SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true", // true per port 465, false per 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.verifyEmail = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Richiesta senza body" });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email richiesta" });
    }

    // Verifica se l'email è già presente
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.json({ message: "Ben tornato!" });
    } else {
      // Dati di default (assicurati che rispettino i vincoli del database)
      const defaultName = "Guest";
      const defaultSurname = "Guest";
      const defaultAddress = "N/A";
      const defaultCity = "N/A";
      const defaultZip = "N/A";
      const defaultProvince = "NA"; // 2 caratteri
      const defaultCountry = "N/A";

      await db.query(
        "INSERT INTO users (email, name, surname, address, city, zip_code, province, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [email, defaultName, defaultSurname, defaultAddress, defaultCity, defaultZip, defaultProvince, defaultCountry]
      );

      const discountCode = "Alcool4ever";
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Codice Sconto BoolBeer",
        text: `Ciao, grazie per esserti registrato. Il tuo codice sconto è: ${discountCode}`,
        html: `<p>Ciao, grazie per esserti registrato.</p><p>Il tuo codice sconto è: <strong>${discountCode}</strong></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Errore nell'invio dell'email:", error);
          return res
            .status(500)
            .json({ error: "Errore nell'invio dell'email", details: error.toString() });
        } else {
          console.log("Email inviata: " + info.response);
          return res.json({
            message: "Email registrata. Ti abbiamo inviato una email con il codice sconto!",
            discount: discountCode,
          });
        }
      });
    }
  } catch (err) {
    console.error("Errore nel verifyEmail:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.toString() });
  }
};
