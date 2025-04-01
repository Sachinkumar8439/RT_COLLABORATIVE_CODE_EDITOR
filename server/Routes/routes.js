const express = require("express");
const router = express.Router();

const {
    CodeOutput,
    getLanguages
} = require('../controllers/apiFetcher');

const {
    saveCode,
    getFiles,
    deleteFile
} = require("../controllers/databaseSaving");

const {
    SignUp,
    LogIn,
} = require("../controllers/Auth");

router.post('/output',CodeOutput);
router.get('/get-languages',getLanguages);


router.post('/code-save',saveCode);
router.get('/get-files',getFiles);
router.delete('/delete-file',deleteFile);


router.post('/sign-up',SignUp);
router.post('/log-in',LogIn);


module.exports = router;