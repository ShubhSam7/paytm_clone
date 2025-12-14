const express = require("express");
const { middleware } = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

router.get("/balance", middleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const amount = await Account.findOne({ userId: req.userId });
  res
    .json({
      balance: amount.balance,
    })
    .status(200);
});

router.post("/transfer", middleware, async (req, res) => {
  try {
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
