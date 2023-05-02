const express = require("express");
const router = express.Router();

const Employee_Table = require("../db/models/employee");

router.get("/", async (_, res) => {
  try {
    const employee = await Employee_Table.findAll();
    res.json({ data: employee });
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

    const employee = await Employee_Table.findByPk(id);

    if (employee === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    res.json({ data: employee });
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
    const employee = await Employee_Table.create({ content });
    res.json({ data: employee });
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

    const employee = await Employee_Table.findByPk(id);

    if (employee === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    await employee.destroy();
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
    const { content } = req.body;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    const employee = await Employee_Table.findByPk(id);

    if (employee === null) {
      res.status(400).json({
        message: "Invalid request",
      });
      return;
    }

    employee.content = content;
    await employee.save();

    res.json({ data: employee });
    return;
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
});

module.exports = router;
