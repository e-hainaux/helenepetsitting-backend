const express = require("express");
const fetch = require("node-fetch");

const verifyRecaptcha = async (recaptchaResponse) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: recaptchaResponse,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Erreur lors de la vérification reCAPTCHA : ", error);
    return false;
  }
};

module.exports = verifyRecaptcha;
