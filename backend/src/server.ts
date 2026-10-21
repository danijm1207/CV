import app from './app';

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 NIDO API REST corriendo en http://localhost:${PORT}`);
  console.log(`📖 Documentación y estado en http://localhost:${PORT}/`);
  console.log(`===============================================`);
});
