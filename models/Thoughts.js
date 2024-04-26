const { DataTypes } = require("sequelize");
const db = require("../db/conn");

// User
const User = require("./Users");

const Thought = db.define("Thought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

Thought.belongsTo(User);
User.hasMany(Thought);

module.exports = Thought;
