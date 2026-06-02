const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Rede Social',
    description: 'API REST para uma rede social com postagens, comentários, curtidas e autenticação JWT.',
    version: '1.0.0',
    contact: {
      name: 'Sara Amabili Castilhos'
    }
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Insira o token JWT no formato: Bearer <token>'
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Autenticação', description: 'Registro e login de usuários' },
    { name: 'Postagens', description: 'CRUD de postagens' },
    { name: 'Curtidas', description: 'Curtir e descurtir postagens' },
    { name: 'Comentários', description: 'Adicionar e remover comentários' }
  ],
  definitions: {
    RegisterBody: {
      name: 'Sara Castilhos',
      email: 'sara@email.com',
      password: 'senha123'
    },
    LoginBody: {
      email: 'sara@email.com',
      password: 'senha123'
    },
    AuthResponse: {
      _id: '64f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Sara Castilhos',
      email: 'sara@email.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    PostBody: {
      title: 'Meu primeiro post',
      content: 'Conteúdo do post aqui.',
      imageUrl: 'https://exemplo.com/imagem.jpg'
    },
    Post: {
      _id: '64f1a2b3c4d5e6f7a8b9c0d2',
      title: 'Meu primeiro post',
      content: 'Conteúdo do post aqui.',
      imageUrl: 'https://exemplo.com/imagem.jpg',
      author: { _id: '64f1a2b3c4d5e6f7a8b9c0d1', name: 'Sara Castilhos', email: 'sara@email.com' },
      likes: [],
      comments: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    CommentBody: {
      text: 'Que post incrível!'
    },
    Comment: {
      _id: '64f1a2b3c4d5e6f7a8b9c0d3',
      text: 'Que post incrível!',
      author: { _id: '64f1a2b3c4d5e6f7a8b9c0d1', name: 'Sara Castilhos', email: 'sara@email.com' },
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    LikeResponse: {
      likesCount: 5,
      liked: true
    },
    ErrorResponse: {
      error: 'Mensagem de erro'
    },
    MessageResponse: {
      msg: 'Operação realizada com sucesso'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);