const express = require("express");
const router = express.Router();

const {
    CodeOutput,
    getLanguages
} = require('../controllers/apiFetcher');

const {
    saveCode,
    getFiles,
    deleteFile,
    getProgram,
} = require("../controllers/databaseSaving");

const {
    SignUp,
    LogIn,
} = require("../controllers/Auth");

const {
    auth,
} = require("../middlewares/Auth");

const {
    LinkGenerate,
    TerminateLiveLink,
    checkLink,
    validateMember,
} = require("../controllers/LiveLink");

router.post('/output',CodeOutput);
router.get('/get-languages',getLanguages);


router.post('/code-save',auth,saveCode);
router.post('/get-files',auth,getFiles);
router.delete('/delete-file',deleteFile);
router.get('/get-program',getProgram,);


router.post('/sign-up',SignUp);
router.post('/log-in',LogIn);

router.post('/live-editor',auth,LinkGenerate);
router.post('/terminate-live-link',auth,TerminateLiveLink);
router.post('/link-validation',checkLink);
router.post('/member-validate',validateMember);


module.exports = router;