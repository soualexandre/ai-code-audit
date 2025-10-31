import app from './app';

const PORT = process.env.PORT || 3030;

const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    app.log.info(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();