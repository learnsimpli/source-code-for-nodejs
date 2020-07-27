const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie/movie.controller');
router.get('/', movieController.getAll);
router.post('/', movieController.create);
router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById);
module.exports = router;