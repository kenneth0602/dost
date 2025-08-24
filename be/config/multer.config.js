const multer = require('multer');
const fs = require('fs')
const maxSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, 'uploads/')
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname)
    }
});

const certStorage = multer.diskStorage({
    destination: (req, file,cb) => {
        // console.log('Req: ', req.params);
        // cb(null, 'uploads/certificate')
        const id = req.params.empID
        const uploadDir = `uploads/certificate/${id}`;
        fs.mkdirSync(uploadDir, { recursive: true }); 
        cb(null, uploadDir)
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname)
    }
});

const scholarshipStorage = multer.diskStorage({
    destination: (req, file,cb) => {
        // console.log('Req: ', req.params);
        // cb(null, 'uploads/certificate')
        const id = req.params.empID
        const uploadDir = `uploads/scholarship`;
        fs.mkdirSync(uploadDir, { recursive: true }); 
        cb(null, uploadDir)
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage, limits: { fileSize: maxSize }});
const uploadCert = multer({storage: certStorage, limits: { fileSize: maxSize }});
const uploadScholarship = multer({storage: scholarshipStorage, limits: { fileSize: maxSize }});

module.exports = {upload, uploadCert, uploadScholarship};