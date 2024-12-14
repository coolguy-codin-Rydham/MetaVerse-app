import { Router } from "express";
import client from "@repo/db/client";
import { adminMiddleware } from "../../middlewares/admin.js";
export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  const parsedData = req.body;
  if (!parsedData) {
    res.status(400).json({
      message: "Validation Failed",
    });
  }

  const element = await client.element.create({
    data: {
      width: parsedData.width,
      height: parsedData.height,
      static: parsedData.static,
      imageUrl: parsedData.imageUrl,
    },
  });

  res.json({
    id: element.id,
  });
});

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  const parsedData = req.body;

  if (!parsedData) {
    res.status(400).json({
      message: "Validation Failed",
    });
  }

  client.element.update({
    where: {
      id: req.params.elementId,
    },
    data: {
      imageUrl: parsedData.imageUrl,
    },
  });
  res.json({
    message: "Element Updated",
  });
});

adminRouter.post("/avatar", async (req, res) => {
  const parsedData = req.body;
  if (!parsedData) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const avatar = await client.avatar.create({
    data: {
      name: parsedData.name,
      imageUrl: parsedData.imageUrl,
    },
  });
  console.log("\n\nAvatar Added", avatar, "\n\n");
  res.json({
    id: avatar.id,
  });
});

adminRouter.post("/map", async (req, res) => {
  const parsedData = req.body;
  if (!parsedData) {
    res.status(400).json({
      message: "Validation Failed",
    });
  }

  const map = client.map.create({
    data: {
      name: parsedData.name,
      width: parseInt(parsedData.dimensions.split("x")[0]),
      height: parseInt(parsedData.dimensions.split("x")[1]),
      thumbnail: parsedData.thumbnail,
      mapElements: {
        create: parsedData.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });
  res.json({
    id: map.id,
  });
});
