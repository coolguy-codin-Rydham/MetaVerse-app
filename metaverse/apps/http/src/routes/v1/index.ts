import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";

export const router = Router();

router.post("/signup", (req, res)=>{
    res.json({
        message:"Signup",
    })
})

router.post("/signin", (req, res)=>{
    res.json({
        message:"Signin",
    })
})

router.get("/elements", (req,res)=>{
    res.json({
        message:"Elements"
    })
})


router.get("/avatars", (req,res)=>{
    res.json({
        message:"Avatars"
    })
})

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter)