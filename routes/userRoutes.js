const express = require('express');
const { createList, addUsers, sendEmail } = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/list', createList);
router.post('/list/:id/users', upload.single('file'), addUsers);
router.post('/list/:id/send-email', sendEmail);

module.exports = router;
