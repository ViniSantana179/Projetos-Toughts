const Tought = require("../models/Thoughts");
const User = require("../models/Users");

const bcrypt = require("bcrypt");

module.exports = class authController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // password match validation
    if (password != confirmpassword) {
      // Mensagem - flash messages
      req.flash("message", "As senha nao conferem, tente novamente!");
      res.render("auth/register");
      return;
    }

    // check if users exists

    const checkIfUsersExists = await User.findOne({ where: { email: email } });
    if (checkIfUsersExists) {
      req.flash("message", "Email ja esta em uso.");
      res.render("auth/register");
      return;
    }

    // create a password

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // initialize session
      req.session.userid = createdUser.id;

      req.flash("message", "Usuario criado com sucesso!");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(`Erro ao criar usuario ${error}`);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // find User
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("message", "Usuario nao encontrado!");
      res.render("auth/login");
      return;
    }

    // check of passwords match
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash("message", "Senha Incorreta!");
      res.render("auth/login");
      return;
    }

    // initialize session
    req.session.userid = user.id;

    req.flash("message", "Autenticacao realizada com sucesso!");
    req.session.save(() => {
      res.redirect("/");
    });
  }
};
