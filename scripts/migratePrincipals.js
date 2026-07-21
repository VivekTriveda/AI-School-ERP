const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Principal = require("../models/Principal");
const User = require("../models/User");

// Change this only if your MongoDB connection is elsewhere
const MONGO_URI = "mongodb://127.0.0.1:27017/questionpaper";

async function migrate() {

    try {

        await mongoose.connect(MONGO_URI);

        console.log("✅ MongoDB Connected");

        const principals = await Principal.find();

        console.log(`Found ${principals.length} principals`);

        for (const p of principals) {

            const exists = await User.findOne({
                email: p.email
            });

            if (exists) {

                console.log(`Skipped: ${p.email}`);

                continue;

            }

            let password = p.password;

            // If old password is not hashed, hash it
            if (!password.startsWith("$2")) {

                password = await bcrypt.hash(password, 10);

            }

            await User.create({

                name: p.principalName,

                email: p.email,

                password,

                role: "principal",

                schoolId: p.schoolId,

                schoolName: p.schoolName,

                status: "Active",

                createdBy: null

            });

            console.log(`Migrated: ${p.principalName}`);

        }

        console.log("🎉 Migration Complete");

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit();

    }

}

migrate();