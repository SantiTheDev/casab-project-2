require("dotenv").config();

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const refreshToken = require("../models/refreshTokens.js");
const Joi = require("@hapi/joi");
const Code = require("../models/Codes");
const Roles = require("../models/Roles");
const { concat } = require("@hapi/joi/lib/base");
const mailcont = require("../controllers/mail.controller");
const { json, redirect } = require("express/lib/response");
const { DATETIME2 } = require("mysql/lib/protocol/constants/types");
const mail = require("@sendgrid/mail");
// validators

const schemaRegister = Joi.object({
  first_name: Joi.string().min(6).max(255).required(),
  last_name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  phone: Joi.number().min(6).required(),
  password: Joi.string().min(6).max(1024).required(),
  username: Joi.string().min(6).max(255).required(),
  last_accesed_ip: Joi.string().min(6).max(255).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  ip_address: Joi.string().min(6).max(255),
});

// app routes

router.get("/dashboard", autheticateToken, async (req, res) => {
  res.json({
    error: null,
    data: {
      title: "mi ruta protegida",
      user: req.user,
    },
  });
});

router.post("/token", async (req, res) => {
  const reToken = req.body.token;
  if (reToken == null) return res.sendStatus(401);
  const findtoken = await refreshToken.findOne({ token: reToken });
  if (!findtoken) return res.sendStatus(403);
  jwt.verify(reToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = createAccessToken({ name: user.name, _id: user._id });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/logout", async (req, res) => {
  await refreshToken
    .deleteOne({ token: req.body.token })
    .then(() => res.sendStatus(204))
    .catch((e) => res.status(500));
});

router.post("/register", async (req, res) => {
  /* validate req.body
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error,
    });
  }
  */
  // already registed?
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "You're registed" });
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    first_name: req.body.fname,
    last_name: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    username: req.body.username,
    last_accesed_ip: req.body.last_accesed_ip,
  });

  try {
    const savedUser = await user.save();
    const tokenMail = mailcont.getToken({
      email: user.email,
      name: user.name,
      time: Date.now(),
    });
    const template = mailcont.getTemplateCorreo(user.first_name, tokenMail);
    console.log(savedUser);
    await mailcont.sendEmail(user.email, "Confirmacion de Correo", template);
    res.json({
      error: "good",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get("/activate/:token", async (req, res) => {
  const { token } = req.params;

  const data = mailcont.getDataToken(token);

  if (data === null) {
    return res.json({ error: "Error al obtener la data" });
  }
  console.log(data);
  const { email, name } = data.data;
  console.log(email, name);
  const user = await User.findOne({ name: name });
  console.log("prueba 2", user);
  if (user === null) {
    return res.json({
      succes: false,
      msg: "this user dont exist",
    });
  }
  if (user.email === email) {
    user.isActive = true;
    await user.save();
    await mailcont.confirmAccountTemplate(user.name)
     /* .then(res => console.log("All is well"))
      .catch(err => console.log("Something goes wrong"))*/
    return res.redirect(
      "http://localhost:3000/login"
    );
  }
});

// PRUEBAAA
router.post("/recovery", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Something goes wrong!", redirect: false });
  } else {
    try {
      const tokenMail = mailcont.getToken({
        email: user.email,
        user: user.name,
      });
      const template = mailcont.getTemplateRecovery(user.name, tokenMail);
      await mailcont.sendEmail(user.email, "RECUPERAR CLAVE", template);
      return res.status(200).json({
        success: true,
        redirect: true,
        msg: "Tu correo ha sido enviado",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, redirect: false, error: "Something goes wrong" });
    }
  }
});

router.post("/change-password/:token", async (req, res) => {
  const { token } = req.params;
  const { data } = mailcont.getDataToken(token);

  const { newPassword, rePassword } = req.body;

  const user = await User.findOne({ email: data.email });
  if (!user) {
    return res.status(400).json({ error: "something goes wrong" });
  } else {
    if (newPassword !== rePassword) {
      return res.status(400).json({
        error: "the passwords are not similar, please try again",
        redirect: false,
      });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
          success: true,
          redirect: true,
          msg: "Your password has been updated successfully",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ error: "something goes wrong", redirect: false });
      }
    }
  }
});
router.get('/confirm-mail-recovery/:token', async(req, res)=>{
  const {token} = req.params
  const data = await mailcont.getDataToken(token)
  const user = await User.findOne({ email: data.data.email });
  if (!user) {
    return res.status(400).json({ error: "something goes wrong" });
  } else{
    return res.redirect(`http://localhost:3000/recovery-pass/${token}`)
  }

})
router.post("/recovery-password/:token", async (req, res) => {
  const { token } = req.params;
  const data = await mailcont.getDataToken(token);
  const { newPassword, rePassword } = req.body;

  const user = await User.findOne({ email: data.data.email });
  if (!user) {
    return res.status(400).json({ error: "something goes wrong" });
  } else {
    if (newPassword !== rePassword) {
      return res
        .status(400)
        .json({ error: "the passwords are not similar, please try again" });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
          success: true,
          redirect: true,
          msg: "Your password has been updated successfully",
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "something goes wrong" });
      }
    }
  }
});

const prueba = async (req, res) => {
  const usuario = await User.findOne({ email: req.body.email });
  console.log(usuario);
  return res.json(usuario);
};
router.post("/get_user", prueba);

// FIN DE PRUEBAAA
router.post("/login", async (req, res) => {
  // authenticate user

  // validations
  const { error } = schemaLogin.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: error.details[0].message, redirect: false });
  console.log(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .json({ error: "User not registed", redirect: false });
  if (user.isActive === false)
    return res
      .status(400)
      .json({ error: "User is not active", redirect: false });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "invalid password", redirect: false });

  if (req.body.ip_address !== user.last_accesed_ip) {
    const code = new Code();
    code.code = generarCode(6);
    console.log(code.code);
    code.userID = user._id;
    await code.save();
    const template = mailcont.getTemplateCode(user.name, code.code);
    await mailcont.sendEmail(
      req.body.email,
      "Codigo de verificacion",
      template
    );
    res.status(400).json({ error: "the IP is not registered", redirect: true });
  }

  try {
    if (validPassword) {
      const Token = createAccessToken(user);
      const reToken = jwt.sign(
        {
          user: user.name,
          _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET
      );

      const retoken = new refreshToken({
        token: reToken,
      });

      const savedReToken = await retoken.save();

      res.header("auth-token", Token).json({
        error: null,
        messaje: "welcome",
        data: {
          access: { Token },
          refresh: { savedReToken },
        },
      });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});
// codes verification and config
const generarCode = (a) => {
  let code = "";
  const numeros = "0123456789";
  for (let x = 0; x < a; x++) {
    let aleatorio = Math.floor(Math.random() * numeros.length);
    code += numeros.charAt(aleatorio);
  }
  console.log("Codigo generado: ", code);
  return code;
};

router.post("/verification", async (req, res) => {
  const { code } = req.body;
  const expira = Date.now();
  const verificacion = await Code.findOne({ code: code });
  console.log(verificacion);
  if (!verificacion) {
    return res.status(400).json({ error: "this code dont exist" });
  } else {
    if (verificacion.isActive === false) {
      return res.status(400).json({ error: "this code is not active" });
    } else {
      const expirate = verificacion.timeExpiration - expira;
      if (expirate < 0.0) {
        verificacion.isActive = false;
        await verificacion.save();
        return res.status(400).json({ error: "this code has been expirated" });
      } else {
        const user = User.findOne({ _id: verificacion.userID });
        try {
          if (user) {
            const Token = createAccessToken(user);
            const reToken = jwt.sign(
              {
                user: user.name,
                _id: user._id,
              },
              process.env.REFRESH_TOKEN_SECRET
            );

            const retoken = new refreshToken({
              token: reToken,
            });

            const savedReToken = await retoken.save();

            res.header("auth-token", Token).json({
              error: null,
              messaje: "welcome",
              data: {
                access: { Token },
                refresh: { savedReToken },
              },
            });
          } else {
            res.send("Not Allowed");
          }
        } catch {
          res.status(500).send();
        }
      }
    }
  }
});
// TIENES QUE ADAPTAR LA FUNCION DE LOS TOKENS PARA QUE SE CREEN LOS CODIGOS Y EN LOS CODIGOS GUARDAR EL ID DEL CLIENTE Y LUEGO USARLOOO PARA CREAR EL TOKEN, SUERTE MI REY
// PUEDES IR A DORMIR, TE AMO

// handling tokens

function createAccessToken(user) {
  return mailcont.getToken({
    name: user.name,
    _id: user._id,
    email: user.email,
    //rol: user.rol
  });
}

function autheticateToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "denied" });
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified.next(); // continue
  } catch (error) {
    res.status(400).json({ error: "token invalid" });
  }
}

module.exports = router;
