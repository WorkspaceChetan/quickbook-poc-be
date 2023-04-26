const express = require("express");
const router = express.Router();

const Account = require("../db/models/account");

router.get("/", async (_, res) => {
  try {
    const accounts = await Account.findAll();
    res.json({ data: accounts });
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

    const account = await Account.findByPk(id);

    if (account === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    res.json({ data: account });
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
    const { content } = req.body;
    const account = await Account.create({ content });
    res.json({ data: account });
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
    const { content } = req.body;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const account = await Account.findByPk(id);

    if (account === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    account.content = content;
    await account.save();

    res.json({ data: account });
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

    const account = await Account.findByPk(id);

    if (account === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    await account.destroy();
    res.json({ data: "success" });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

module.exports = router;
