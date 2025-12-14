const express = require("express");
const router = express.Router();
const z = require("zod");
const middleware = require("../middleware");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const userZod = z.object({
  username: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const user = req.body();
    const parsedData = userZod.safeParse(user);
    if (!parsedData) {
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

    const putData = await User.create({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    });

    const userId = user._id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res
      .json({
        msg: "User created successfully",
        token: token,
      })
      .status(200);
  } catch (e) {
    res.status(500).json({
      message: "Error while creating user",
    });
  }
});

router.post("/singin", async (req, res) => {
  try {
    const user = signinBody.safeParse(req.body());

    if (!user) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const success = await User.findOne({
      body: {
        username: user.username,
        password: user.password,
      },
    });

    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    if (user) {
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
    }

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
  lastName: z.string().min(1).optiona(),
  password: z.string().min(8).optional(),
});

router.put("/", middleware, async (req, res) => {
  const data = req.body();
  const parsed = update.safeParse(data);
  if (!parsed) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ userId: _id }, data);

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find(
    {
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
    },
    function (err, docs) {
      if (!err) res.send(docs);
    }
  );

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
