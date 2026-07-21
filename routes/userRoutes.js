const express = require("express");

const router = express.Router();

const {
    login,
    createUser,
    createPrincipal,
     getPrincipals,
     deletePrincipal,
    updatePrincipal,
    changePrincipalStatus
} = require("../controllers/userController");

// Login
router.post("/login", login);

// Create User (Admin / Principal / Teacher)
router.post("/create", createUser);

router.post("/create-principal", createPrincipal);


router.get("/principals", getPrincipals);
router.get("/principals/:schoolId", getPrincipals);

router.put("/principal/:id", updatePrincipal);
router.patch("/principal/status/:id",changePrincipalStatus);

router.delete("/principal/:id", deletePrincipal);

module.exports = router;