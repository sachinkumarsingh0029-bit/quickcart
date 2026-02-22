const handlebars = require('handlebars');
const fs = require('fs');
const path = require("path");

async function renderTemplate(templatePath, data) {
    const templateSource = fs.readFileSync(path.join(__dirname, templatePath), "utf8");
    const template = handlebars.compile(templateSource);
    const options = {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        allowAccessToAllDataProperties: true
    };
    return template(data, {
        noEscape: true,
        ...options,
        runtimeOptions: {
            ...options
        }
    });
}

module.exports = renderTemplate;
