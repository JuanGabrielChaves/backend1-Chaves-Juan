import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import CartManager from "../dao/db/cart-manager-db.js";
import UserModel from "../dao/models/usuarios.model.js";
import { createHash, isValidPassword } from "../util/util.js";

// Instancia del gestor de carritos
const cartManager = new CartManager();

// Clave secreta para firmar los JWT
const JWT_SECRET = "coderhouse"; 

// Función para extraer el token JWT desde las cookies
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

const initializePassport = () => {

    // Estrategia de registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
            let user = await UserModel.findOne({ email: email });
            if (user) return done(null, false);

            const carrito = await cartManager.crearCarrito();

            let newUser = {
                first_name,
                last_name,
                email,
                cart_id: carrito._id, // Guarda el ID del carrito en el nuevo usuario
                age,
                password: createHash(password),
                role: role || "usuario"
            }

            let result = await UserModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                console.log("El usuario no existe!!");
                return done(null, false);
            }

            if (!isValidPassword(password, user)) return done(null, false);

            // Retorna el usuario para que se emita el JWT
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

    // Estrategia de autenticación JWT basada en cookies
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            // Buscar al usuario por el campo 'email' que viene en el token
            const user = await UserModel.findOne({ email: jwt_payload.email });
            if (!user) {
                return done(null, false);  // Usuario no encontrado
            }
            return done(null, user);  // Usuario encontrado
        } catch (error) {
            return done(error);
        }
    }));
export default initializePassport;
