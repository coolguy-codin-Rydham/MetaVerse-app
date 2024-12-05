import client from "@repo/db/client"
import { userMiddleware } from "../../middlewares/user.js";
import { Router } from "express";
export const userRouter = Router();

userRouter.post("/metadata",userMiddleware, async(req, res)=>{
    const parsedData = req.body;

    if(!parsedData || !parsedData.avatarId){
        res.status(400).json({
            message:"Validation failed"
        })
    }

    await client.user.update({
        where:{
            id: req.userId
        },
        data:{
            avatarId:parsedData.avatarId
        }
    })

    res.json({
        message:"Metadata Updated"
    })
})

userRouter.get("/metadata/bulk", async(req, res)=>{
    const userIds  = (req.query.userIds ?? "[]").slice(1, req.query.userIds?.length-2).split(",");

    const metadata = await client.user.findMany({
        where:{
            id:{
                in:userIds
            }
        }, select:{
            avatar:true
        }
    })

    res.json({
        avatars:metadata.map(m=>({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })

})

// /api/v1/user/metadata/bulk?userIds=[1,3,51]