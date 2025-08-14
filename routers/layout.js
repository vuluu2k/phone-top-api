const express = require('express');

const router = express.Router();
const layoutControlller = require('../controllers/layoutController');

router.get('/view_layout', layoutControlller.getLayout);
router.post('/create_layout', layoutControlller.createLayout);
router.delete('/delete_layout/:id', layoutControlller.deleteLayout);
router.patch('/edit_layout', layoutControlller.editLayout);

module.exports = router;
