const express = require("express");
const router = express.Router();

const User = require("../db/models/user");

router.get("/", async (_, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const users = await User.findByPk(id);

    if (users === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    res.json({ data: users });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, dob, exp, moblino } = req.body;
    const users = await User.create({ name, email, dob, exp, moblino });
    res.json({ data: users });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, dob, exp, moblino } = req.body;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const users = await User.findByPk(id);

    if (users === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    users.name = name;
    users.email = email;
    users.dob = dob;
    users.moblino = moblino;
    users.exp = exp;

    await users.save();

    res.json({ data: users });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const users = await User.findByPk(id);

    if (users === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    await users.destroy();
    res.json({ data: "Data Deleted Successfully." });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

module.exports = router;
