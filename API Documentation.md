# Documentación Completa de la API

## Índice
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Configuración y Conexión a la Base de Datos](#configuración-y-conexión-a-la-base-de-datos)
3. [Modelos](#modelos)
4. [Autenticación](#autenticación)
5. [Rutas](#rutas)
6. [Controladores](#controladores)
7. [Configuración de la Aplicación](#configuración-de-la-aplicación)

## Estructura del Proyecto

La API está estructurada de la siguiente manera:

- `index.js`: Punto de entrada de la aplicación
- `app.js`: Configuración principal de Express
- `db.js`: Configuración de la conexión a MongoDB
- `auth/auth.js`: Configuración de Passport para autenticación
- `models/`: Definiciones de los modelos de datos
- `routes/`: Definiciones de las rutas de la API
- `controllers/`: Lógica de negocio para las rutas

## Configuración y Conexión a la Base de Datos

### db.js

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(">>>>> DB is connected");
  } catch (error) {
    console.log(error);
  }
};
```

Este archivo maneja la conexión a la base de datos MongoDB utilizando Mongoose. La URL de conexión se obtiene de las variables de entorno.

## Modelos

### userModel.js

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model("User", userSchema);
```

Este modelo define la estructura de los documentos de usuario en la base de datos.

### publicationModel.js

```javascript
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  startHour: {
    type: String,
    required: true,
  },
  startMinute: {
    type: String,
    required: true,
  },
  finishHour: {
    type: String,
    required: true,
  },
  finishMinute: {
    type: String,
    required: true,
  },
});

const publicationSchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  municipality: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  propertyAddress: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  propertySize: {
    type: String,
    required: true,
  },
  propertyBedrooms: {
    type: String,
    required: true,
  },
  propertyBathrooms: {
    type: String,
    required: true,
  },
  propertyFloors: {
    type: String,
    required: true,
  },
  propertyParking: {
    type: Number,
    required: true,
  },
  propertyFurnished: {
    type: String,
    required: true,
  },
  propertyDescription: {
    type: String,
    required: true,
  },
  propertyPrice: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: false,
  },
  scheduleViewing: [scheduleSchema],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  status: {
    type: String,
    enum: ["unapproved", "approved", "pending"],
    default: "pending",
  },
}, {
  timestamps: true,
});

export default mongoose.model("Publication", publicationSchema);
```

Este modelo define la estructura de los documentos de publicación en la base de datos.

## Autenticación

### auth/auth.js

```javascript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Configuración de la estrategia de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      // Lógica para encontrar o crear un usuario basado en el perfil de Google
    }
  )
);

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    // Lógica para validar el token JWT
  })
);

// Serialización y deserialización de usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Lógica para deserializar el usuario
});

export default passport;
```

Este archivo configura Passport para la autenticación con Google OAuth y JWT.

## Rutas

### authRoutes.js

```javascript
import express from "express";
import passport from "../auth/auth.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/userModel.js";

const router = express.Router();
router.use(cookieParser());

// Ruta para iniciar la autenticación con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Lógica para manejar el callback de Google y generar un token JWT
  }
);

// Verificar autenticación
router.get("/check", (req, res) => {
  // Lógica para verificar el token JWT
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  // Lógica para cerrar sesión
});

// Obtener información del usuario
router.get("/user", (req, res) => {
  // Lógica para obtener información del usuario autenticado
});

export default router;
```

Este archivo define las rutas relacionadas con la autenticación.

### adminRoutes.js

```javascript
import express from "express";
import User from "../models/userModel.js";
import Publication from "../models/publicationModel.js";

const router = express.Router();

// Middleware para verificar si el usuario es admin
async function isAdmin(req, res, next) {
  // Lógica para verificar si el usuario es admin
}

// Obtener todos los usuarios (solo admin)
router.get("/users", isAdmin, async (req, res) => {
  // Lógica para obtener todos los usuarios
});

// Obtener todas las publicaciones (solo admin)
router.get("/publications", isAdmin, async (req, res) => {
  // Lógica para obtener todas las publicaciones
});

export default router;
```

Este archivo define las rutas administrativas.

### publicationRoutes.js

```javascript
import express from "express";
import { createPublication } from "../controllers/publicationController.js";
import passport from "../auth/auth.js";

const router = express.Router();

// Crear una nueva publicación
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createPublication
);

export default router;
```

Este archivo define las rutas relacionadas con las publicaciones.

## Controladores

### publicationController.js

```javascript
import Publication from "../models/publicationModel.js";
import passport from "passport";

export const createPublication = async (req, res) => {
  // Lógica para crear una nueva publicación
};
```

Este controlador maneja la lógica para crear nuevas publicaciones.

## Configuración de la Aplicación

### app.js

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "./auth/auth.js";
import authRoutes from "./routes/authRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Inicialización de Passport
app.use(passport.initialize());

// Rutas
app.use("/auth", authRoutes);
app.use("/publications", publicationRoutes);
app.use("/admin", adminRoutes);

export default app;
```

Este archivo configura la aplicación Express, incluyendo middleware, CORS y rutas.

### index.js

```javascript
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT);
console.log("Server on port", PORT);
```

Este es el punto de entrada de la aplicación, que inicia el servidor y conecta a la base de datos.

