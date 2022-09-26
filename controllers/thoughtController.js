const { ObjectId } = require('mongoose').Types;
const { Thought, Reaction, User } = require('../models');

// aggregate function to get the length of thought's reaction
const reactionCount = async (thoughtId) =>
    Thought.aggregate([
        { $match: { _id: ObjectId(thoughtId) } },
        { $unwind: '$reactions' },
        {
            $group: {
                _id: ObjectId(thoughtId),
                reactionCount: { $count: '$reactions.reactionId' }
            }
        }
    ])

module.exports = {
    // get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                    reactionCount: await reactionCount(req.params.thoughtId),
                };
                return res.json(thoughtObj)
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // get single thought by id 
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then(async (thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that id' })
                    : res.json({
                        thought,
                        reactionCount: await reactionCount(req.params.thoughtId)
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Create a new thought and update the user's thought array.
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID',
                    })
                    : res.json('Created the thought 🎉')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // update a thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // delete a thought by id
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought deleted but no user with this id!',
                    })
                    : res.json({ message: 'Thought successfully deleted!' })
            )
            .catch((err) => res.status(500).json(err));
    },

    // Add reactions to Thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Remove reactions from thought
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {reactionId: req.params.reactionId} } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
        
    },
}