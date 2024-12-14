import { Router } from "express";
import { userRouter } from "./user.js";
import { adminRouter } from "./admin.js";
import client from "@repo/db/client";
import { compare, hash } from "../../scrypt.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config.js";
import { spaceRouter } from "./space.js";
export const router = Router();

router.post("/signup", async (req, res) => {
  const parsedData = req.body;

  console.log(parsedData)

  if (
    !parsedData ||
    !parsedData.username ||
    !parsedData.password
  ) {
    res.status(400).json({ message: "Validation Failed" });
    return;
  }

  const hashedPassword = await hash(parsedData.password);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.username,
        password: hashedPassword,
        role: parsedData.role === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "User Already Exists",
    });
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = req.body;
  if (
    !parsedData ||
    !parsedData.username ||
    !parsedData.password
  ) {
    res.status(403).json({ message: "Validation Failed" });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.username,
      },
    });

    if (!user) {
      res.status(403).json({
        message: "User not found",
      });
      return;
    }

    const isValid = await compare(parsedData.password, user.password);

    if (!isValid) {
      res.status(403).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
    });
  } catch (e) {
    res.status(400).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/elements", async(req, res) => {
  const elements = await client.element.findMany()

  res.json({
    elements: elements.map(e=>(
      {
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static,
      }
    ))
  })
});

router.get("/avatars", async(req, res) => {
  const avatars =await client.avatar.findMany({

  })
  res.json({
    avatars: avatars.map(x=>({
      id: x.id,
      imageUrl: x.imageUrl,
      name: x.name
    }))
  })
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
