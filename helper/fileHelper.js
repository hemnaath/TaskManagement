const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = async(req, file, cb)=>{  
    const allowedFileType = ['image/jpeg', 'image/jpg', 'application/pdf'];
    if(allowedFileType.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('File Type Not Allowed'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = { upload };
