const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.getComment);
router.post('/', commentController.createComment);
router.patch('/', commentController.editComment);
router.delete('/', commentController.deleteComment);

module.exports = router;
