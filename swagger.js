const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Calender API',
        version: '1.0.0',
        description: 'A simple Express API application documented with Swagger',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
        {
            url :'https://calender-api-gules.vercel.app/',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./api-docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options)

module.exports = { swaggerUi, swaggerSpec }
