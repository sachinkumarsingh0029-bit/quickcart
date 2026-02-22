const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

async function renderTemplate(templatePath, data) {
  try {
    // 🔥 IMPORTANT FIX: Always go inside template folder first
    const fullPath = path.join(__dirname, templatePath);

    const templateSource = fs.readFileSync(fullPath, "utf8");

    const template = handlebars.compile(templateSource);

    return template(data);
  } catch (error) {
    console.log("Template Render Error:", error.message);
    throw error;
  }
}

module.exports = renderTemplate;