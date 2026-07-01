const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path");

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Reglas de acceso por rol
// 660 = usuarios autenticados pueden leer/escribir
// 640 = solo el dueño puede modificar
// 600 = solo el dueño puede leer y modificar
const rules = auth.rewriter({
  users:    660,
  multas:   660,
  noticias: 660,
  reservas: 660,
});

app.db = router.db;

app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ SICRCB API corriendo en: http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   POST   http://localhost:${PORT}/register   → Registrar usuario`);
  console.log(`   POST   http://localhost:${PORT}/login      → Iniciar sesión`);
  console.log(`\n   GET    http://localhost:${PORT}/multas     → Listar multas`);
  console.log(`   POST   http://localhost:${PORT}/multas     → Crear multa`);
  console.log(`   PUT    http://localhost:${PORT}/multas/:id → Actualizar multa`);
  console.log(`   DELETE http://localhost:${PORT}/multas/:id → Eliminar multa`);
  console.log(`\n   GET    http://localhost:${PORT}/noticias     → Listar noticias`);
  console.log(`   POST   http://localhost:${PORT}/noticias     → Crear noticia`);
  console.log(`   PUT    http://localhost:${PORT}/noticias/:id → Actualizar noticia`);
  console.log(`   DELETE http://localhost:${PORT}/noticias/:id → Eliminar noticia`);
  console.log(`\n   GET    http://localhost:${PORT}/reservas     → Listar reservas`);
  console.log(`   POST   http://localhost:${PORT}/reservas     → Crear reserva`);
  console.log(`   PUT    http://localhost:${PORT}/reservas/:id → Actualizar reserva`);
  console.log(`   DELETE http://localhost:${PORT}/reservas/:id → Eliminar reserva`);
  console.log(`\n👤 Usuarios de prueba:`);
  console.log(`   Admin:       admin@sicrcb.com      / admin123`);
  console.log(`   Propietario: propietario@sicrcb.com / user123`);
});