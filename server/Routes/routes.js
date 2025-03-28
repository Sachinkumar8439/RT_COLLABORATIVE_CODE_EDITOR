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
} = require("../controllers/databaseSaving")

router.post('/output',CodeOutput);
router.get('/get-languages',getLanguages);


router.post('/code-save',saveCode);
router.get('/get-files',getFiles);
router.delete('/delete-file',deleteFile);





module.exports = router;