const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughId/reactions').post(addReaction)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughId/reactions/reactionId').delete(removeReaction)

module.exports = router;
