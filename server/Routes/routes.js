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

const {
    auth,
} = require("../middlewares/Auth");

router.post('/output',CodeOutput);
router.get('/get-languages',getLanguages);


router.post('/code-save',auth,saveCode);
router.get('/get-files',auth,getFiles);
router.delete('/delete-file',deleteFile);


router.post('/sign-up',SignUp);
router.post('/log-in',LogIn);


module.exports = router;