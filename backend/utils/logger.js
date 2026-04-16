const Log = require("../models/Log");

const logActivity = async (userId, action) => {
    await Log.create({ userId, action });
};

module.exports = logActivity;