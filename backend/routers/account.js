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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({
      userId: req.userId,
    }).session(session);

    if (!account || amount > account.balance) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();

    res.json({
      message: "Transaction successfully",
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Transaction failed",
    });
  }
});

module.exports = router;
