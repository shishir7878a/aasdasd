const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./userModel');

const Note = sequelize.define('Note', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
});

Note.belongsTo(User);
User.hasMany(Note);

module.exports = Note;
