const express = require("express");
const mongoose = require("mongoose");
const { middleware } = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

router.get("/balance", middleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", middleware, async (req, res) => {
  try {
    const { amount, to } = req.body;

    // 1. Validation: Ensure amount is valid
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 2. Fetch sender account
    const account = await Account.findOne({ userId: req.userId });
    if (!account || account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 3. Fetch recipient account
    const toAccount = await Account.findOne({ userId: to });
    if (!toAccount) {
      return res.status(400).json({ message: "Recipient account not found" });
    }

    // 4. Perform the transfer (without transactions for standalone MongoDB)
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    );

    await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

    res.json({ message: "Transfer successful" });
  } catch (e) {
    console.error("Transfer Error:", e);
    res.status(500).json({ message: e.message || "Transaction failed" });
  }
});

module.exports = router;
