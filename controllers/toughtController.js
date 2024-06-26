const { where, or } = require("sequelize");
const Tought = require("../models/Thoughts");
const User = require("../models/Users");

const { Op } = require("sequelize");

module.exports = class toughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order == "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const toughts = toughtData.map((result) => result.get({ plain: true }));

    let toughtQty = toughts.length;

    if (!toughtQty) toughtQty = 0;

    res.render("toughts/home", { toughts, search, toughtQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
      return;
    }

    const toughts = user.Thoughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length == 0) emptyToughts = true;

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static async createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    console.log(req.session.userid);
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento criado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log("Erro: ", error);
      req.flash("message", "Falha ao cria Pensamento!");
    }
  }

  static async removeTought(req, res) {
    const { id } = req.body;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const { id, title } = req.body;

    const tought = {
      title: title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};
