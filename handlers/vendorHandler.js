const express = require("express");
const router = express.Router();

const Vendor = require("../db/models/vendor");

router.get("/", async (_, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json({ data: vendors });
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

    const vendor = await Vendor.findByPk(id);

    if (vendor === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    res.json({ data: vendor });
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
    const vendor = await Vendor.create({ content });
    res.json({ data: vendor });
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

    const vendor = await Vendor.findByPk(id);

    if (vendor === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    vendor.content = content;
    await vendor.save();

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

    const vendor = await Vendor.findByPk(id);

    if (vendor === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    await vendor.destroy();
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
