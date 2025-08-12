const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Election = require('./electionModel');

const Candidate = sequelize.define('Candidate', {
  name: { type: DataTypes.STRING, allowNull: false },
});

Candidate.belongsTo(Election);
Election.hasMany(Candidate);

module.exports = Candidate;
