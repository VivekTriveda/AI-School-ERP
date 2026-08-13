const XLSX = require("xlsx");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const Student =
require("../models/Student");



function parseExcelDate(value) {

    if (!value) return null;

    // If Excel stores date as number
    if (typeof value === "number") {

        const excelEpoch = new Date(1899, 11, 30);

        excelEpoch.setDate(excelEpoch.getDate() + value);

        return excelEpoch;
    }

    // If date is in DD/MM/YYYY format
    if (typeof value === "string") {

        const parts = value.split("/");

        if (parts.length === 3) {

            const [day, month, year] = parts;

            return new Date(year, month - 1, day);
        }

        const d = new Date(value);

        if (!isNaN(d)) return d;
    }

    return null;
}

exports.importStudents = async (req,res)=>{

try{

    const workbook =
    XLSX.readFile(req.file.path);

    const sheet =
    workbook.Sheets[
        workbook.SheetNames[0]
    ];

    const rows =
    XLSX.utils.sheet_to_json(sheet);

const students = [];
const duplicateStudents = [];

for (const row of rows) {

    const admissionNo = String(row["Admission No"]).trim();

    // Check if Admission Number already exists

    const exists = await Student.findOne({

    schoolId: req.body.schoolId,

    admissionNo

   });

   if (exists) {

    duplicateStudents.push(admissionNo);

    continue;

   }

    const defaultPassword = "Stu@" + admissionNo;

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    

    students.push({

        schoolId: req.body.schoolId,

        admissionNo,

        rollNo: row["Roll No"],

        studentName: row["Student Name"],

        fatherName: row["Father Name"],

        motherName: row["Mother Name"],

        gender: row["Gender"],

        className: row["Class"],

        section: row["Section"],

        mobile: row["Mobile"],

        dob: parseExcelDate(row["DOB"]),

        address: row["Address"],

        username: admissionNo,

        password: hashedPassword,

        role: "student"

    });

}

    try {

    const result = await Student.insertMany(students);

    

} catch (err) {

    console.error(err);

    return res.status(500).json({
        success: false,
        message: err.message
    });

}

    fs.unlinkSync(req.file.path);

  res.json({

    success: true,

    imported: students.length,

    duplicates: duplicateStudents.length,

    duplicateStudents,

    message: `${students.length} students imported successfully.`,

    login: {

        username: "Admission Number",

        password: "Stu@AdmissionNumber"

    }

});

}

catch(err){

console.error(err);

res.status(500).json({

success:false,

message:"Import failed"

});

}

};