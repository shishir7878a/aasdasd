const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./userModel');
const Candidate = require('./candidateModel');
const Election = require('./electionModel');

const Vote = sequelize.define('Vote', {}, {
  indexes: [
    { unique: true, fields: ['UserId', 'ElectionId'] }
  ]
});

Vote.belongsTo(User);
Vote.belongsTo(Candidate);
Vote.belongsTo(Election);

User.hasMany(Vote);
Candidate.hasMany(Vote);
Election.hasMany(Vote);

module.exports = Vote;
