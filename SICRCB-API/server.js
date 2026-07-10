const jsonServer = require("json-server");
const auth = require("json-server-auth");
const jwt = require("jsonwebtoken");
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
app.use(jsonServer.bodyParser);

app.use((req, res, next) => {
  const authorization = req.headers.authorization || ""
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null
  const claims = token ? jwt.decode(token) : null

  if (claims && claims.sub) {
    req.userId = claims.sub
  }

  next()
})

app.use((req, res, next) => {
  const userId = req.userId
  if (!userId) {
    return next()
  }

  req.body = req.body || {}
  if (req.method === "POST" && req.path === "/reservas") {
    req.body.userId = userId
  }

  if (req.method === "PUT" && req.path.startsWith("/reservas/")) {
    req.body.userId = userId
  }

  next()
})

const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).jsonp("Unauthorized")
  }
  next()
}

app.post("/reservas", requireAuth, (req, res) => {
  req.body = req.body || {}
  req.body.userId = req.userId
  const created = app.db.get("reservas").insert(req.body).write()
  res.status(201).jsonp(created)
})

app.get("/reservas", requireAuth, (req, res) => {
  const reservas = app.db
    .get("reservas")
    .filter((item) => String(item.userId) === String(req.userId))
    .value()
  res.json(reservas)
})

app.get("/reservas/:id", requireAuth, (req, res) => {
  const reservation = app.db.get("reservas").getById(req.params.id).value()
  if (!reservation || String(reservation.userId) !== String(req.userId)) {
    return res.status(403).jsonp("Private resource access: entity must have a reference to the owner id")
  }
  res.json(reservation)
})

app.put("/reservas/:id", requireAuth, (req, res) => {
  const reservation = app.db.get("reservas").getById(req.params.id).value()
  if (!reservation || String(reservation.userId) !== String(req.userId)) {
    return res.status(403).jsonp("Private resource access: entity must have a reference to the owner id")
  }
  const updated = app.db
    .get("reservas")
    .getById(req.params.id)
    .assign({ ...req.body, userId: req.userId })
    .write()
  res.json(updated)
})

app.delete("/reservas/:id", requireAuth, (req, res) => {
  const reservation = app.db.get("reservas").getById(req.params.id).value()
  if (!reservation || String(reservation.userId) !== String(req.userId)) {
    return res.status(403).jsonp("Private resource access: entity must have a reference to the owner id")
  }
  app.db.get("reservas").remove({ id: reservation.id }).write()
  res.status(200).jsonp({})
})

app.put("/users/:id", requireAuth, (req, res) => {
  const userId = String(req.userId)
  const requestedId = String(req.params.id)
  if (userId !== requestedId) {
    return res.status(403).jsonp("No autorizado para modificar este usuario")
  }

  const user = app.db.get("users").getById(userId).value()
  if (!user) {
    return res.status(404).jsonp("Usuario no encontrado")
  }

  const updates = {
    nombres: req.body.nombres || user.nombres,
    apellidos: req.body.apellidos || user.apellidos,
    numeroDocumento: req.body.numeroDocumento || user.numeroDocumento,
    tipoDocumento: req.body.tipoDocumento || user.tipoDocumento,
    celular: req.body.celular || user.celular,
    email: req.body.email || user.email,
  }

  const updatedUser = app.db
    .get("users")
    .getById(userId)
    .assign(updates)
    .write()

  res.json(updatedUser)
})

app.use(rules);
app.use(auth);
app.use(router);

const PORT = process.env.PORT || 3000;
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