// import multer from 'multer'

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'public/images'); // Specify the destination folder
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname); // Use original filename
//     }
// });

// const upload = multer({ storage: storage });


// export default upload


















import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/resumes'); // Save PDFs to public/resumes
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;