const express = require("express");
const router = express.Router();

const User = require("../db/models/user");

router.get("/", async (_, res) => {
  try {
    const user = await User.findAll();
    res.json({ data: user });
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

    const user = await User.findByPk(id);

    if (user === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    res.json({ data: user });
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
    const { Name, EmailId, Dob, Exp } = req.body;
    const user = await User.create({ Name, EmailId, Dob, Exp });
    res.json({ data: user });
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

    const user = await User.findByPk(id);

    if (user === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    await user.destroy();
    res.json({ data: "success" });
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
    const { Name, EmailId, Dob, Exp } = req.body;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const user = await User.findByPk(id);

    if (user === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    user.Name = Name;
    user.EmailId = EmailId;
    user.Dob = Dob;
    user.Exp = Exp;

    await user.save();

    res.json({ data: user });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

module.exports = router;
