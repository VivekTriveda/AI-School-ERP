const School = require("../models/School");

// Get School Settings
exports.getSettings = async (req, res) => {

    try {

        const school = await School.findById(req.params.id);

        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found"
            });
        }

        res.json({
            success: true,
            school
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Save Settings
exports.saveSettings = async (req, res) => {

    try {

        const school = await School.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json({

            success: true,

            message: "Settings Updated",

            school

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};