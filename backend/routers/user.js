const express = require("express");
const router = express.Router();
const z = require("zod");
const { middleware } = require("../middleware");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const userZod = z.object({
  username: z.string().email().min(2).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  password: z.string().min(8),
});

const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const user = req.body;
    const parsedData = userZod.safeParse(user);
    if (!parsedData.success) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }

    const existing = await User.findOne({
      username: user.username,
    });

    if (existing) {
      return res.status(411).json({
        message: "Email already taken/Incorrect inputs",
      });
    }

    const newUser = await User.create({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    });

    const userId = newUser._id;

    await Account.create({
      userId,
      balance: 14636,
    });

    // const token = jwt.sign(
    //   {
    //     userId,
    //   },
    //   JWT_SECRET
    // );

    res
      .json({
        msg: "User created successfully",
      })
      .status(200);
  } catch (e) {
    res.status(500).json({
      message: "Error while creating user",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const validation = signinBody.safeParse(req.body);

    if (!validation.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const user = await User.findOne({
      username: validation.data.username,
      password: validation.data.password,
    });

    if (!user) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;

    res.status(411).json({
      message: "Error while logging in",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error while logging in",
    });
  }
});

const update = z.object({
  username: z.string(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

router.put("/", middleware, async (req, res) => {
  const data = req.body;
  const parsed = update.safeParse(data);
  if (!parsed.success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, parsed.data);

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
