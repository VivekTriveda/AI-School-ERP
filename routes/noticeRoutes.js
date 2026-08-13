const express = require("express");
const router = express.Router();
const uploadNotice = require("../middleware/uploadNotice");
const noticeController = require("../controllers/noticeController");

// Create
router.post("/",uploadNotice.single("attachment"),noticeController.createNotice);

// School Notices
router.get("/school/:schoolId", noticeController.getSchoolNotices);

// Update
router.put("/:id", uploadNotice.single("attachment"), noticeController.updateNotice);



// Delete
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;