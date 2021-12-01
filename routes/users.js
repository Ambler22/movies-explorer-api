const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
