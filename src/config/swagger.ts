import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chat Backend API',
    version: '1.0.0',
    description: 'API documentation for Chat Backend',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  //apis: ['./src/modules/**/*.ts'], // Path to your API routes
  apis: ['./src/docs/**/*.ts'],

};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
