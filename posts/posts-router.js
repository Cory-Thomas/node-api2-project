const express = require( "express" );
const router = express.Router();
const db = require("../data/db.js");

router.post( "/", (req, res) => {
    db.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: "Error adding the post",
            });
        });
});

function isValidComment(comment) {
    return Boolean(comment.text && comment.post_id);
};

router.post( "/:id/comments", (req, res) => {
    const comment = req.body; // comment data
    if (isValidComment(comment)) {
        db.insertComment(comment)
            .then(result => {
                res.status(201).json({ result });
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
    } else {
        res.status(400).json({ message: "please provide all data" });
    }
});

router.get( "/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

router.get( "/:id", async (req, res) => {
    try {
        const posts = await db.findById(req.params.id);
        const post = posts[0];
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get( "/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            res.status(200).json({ comments });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

router.delete( "/:id", (req, res) => {
    db.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "The post has been nuked" });
            } else {
                res.status(404).json({ message: "The post could not be found" });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: "Error removing the post",
            });
        });
});

router.put( "/:id", (req, res) => {
    const changes = req.body;
    db.update(req.params.id, changes)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post could not be found" });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: "Error updating the post",
            });
        });
});

module.exports = router;