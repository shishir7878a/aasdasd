const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { vote, getVotes } = require('../controller/voteController');

router.post('/', auth, vote);
router.get('/', auth, getVotes);

module.exports = router;
