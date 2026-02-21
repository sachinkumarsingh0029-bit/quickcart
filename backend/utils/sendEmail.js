const SibApiV3Sdk = require("sib-api-v3-sdk");
const renderTemplate = require("../template/renderTemplate");

async function sendEmail(email, data, templateName) {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const html = await renderTemplate(templateName, data);

    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "QuickCart",
      },
      subject: data.subject,
      htmlContent: html,
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully via Brevo ✅");
    return result;

  } catch (error) {
    console.log("Brevo Email Error:", error.response?.body || error.message);
    return null;
  }
}

module.exports = sendEmail;