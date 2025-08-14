const express = require('express');

const router = express.Router();
const categoryControlller = require('../controllers/categoryController');

router.get('/view', categoryControlller.getCategory);
router.post('/create', categoryControlller.createCategory);
router.delete('/delete/:id', categoryControlller.deleteCategory);
router.patch('/edit/:id', categoryControlller.editCategory);

module.exports = router;
