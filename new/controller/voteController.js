const Vote = require('../model/voteModel');
const Candidate = require('../model/candidateModel');
const Election = require('../model/electionModel');

exports.vote = async (req, res) => {
  try {
    const { candidateId, electionId } = req.body;
    const vote = await Vote.create({ CandidateId: candidateId, ElectionId: electionId, UserId: req.userId });
    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getVotes = async (req, res) => {
  const votes = await Vote.findAll();
  res.json(votes);
};
