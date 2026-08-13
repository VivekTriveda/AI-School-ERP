const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/notices");
    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [

        "application/pdf",

        "image/png",

        "image/jpeg",

        "image/jpg",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Unsupported File Type"));

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024

    }

});