const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Log = require("../models/Log");

app.use("/api/logs", require("./routes/logRoutes"));

// Only admin can see logs
router.get("/", auth, role("admin"), async (req, res) => {
    const logs = await Log.find();
    res.json(logs);
});

module.exports = router;