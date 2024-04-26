const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("thoughts2", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate(); //Conecta ao banco
  console.log("Conectamos com sucesso!");
} catch (error) {
  console.log("Nao foi possivel conectar: ", error);
}

module.exports = sequelize;
