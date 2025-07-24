import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Message from "../model/message.model.js"
import Conversation from "../model/conversation.model.js"
import { io, onlineUsers } from "../index.js";



//send messages...
export const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.userId;
    const reciverId = req.params.reciverId;
    const message = req.body.message;

    if (!senderId || !reciverId || !message) {
        throw new ApiError(404, "All feilds are required.");
    }
    console.log("senderId:", senderId, "reciverId:", reciverId, "Message:", message)
    let conversation = await Conversation.findOne({
        participents: { $all: [senderId, reciverId] }
    })

    console.log("conversation:", conversation)

    if (!conversation) {
        conversation = await Conversation.create({
            participents: [senderId, reciverId],
        })
    }
    const newMessage = await Message.create({
        senderId,
        reciverId,
        message
    })

    if (newMessage) {
        conversation.mesages.push(newMessage._id);
        await conversation.save();
    }

    
    //socket.io
    const reciverSocketIds = onlineUsers.get(reciverId); 
    if (reciverSocketIds && reciverSocketIds.size > 0) {
        reciverSocketIds.forEach(sockId => {
            io.to(sockId).emit("newMessage", {
                _id: newMessage._id,
                senderId,
                reciverId,
                message,
                createdAt: newMessage.createdAt,
            });
        });
        console.log(newMessage.createdAt);
        // console.log(`Sent message to ${reciverId} on ${reciverSocketIds.size} sockets`);
    }



    res.status(200).json(new ApiResponse(200,
        newMessage, "new message created and linkd or created conversation"
    ))
}
)

//get messages...
export const getmessage = asyncHandler(async (req, res) => {
    const myId = req.userId;
    const otherId = req.params.otherId;
    // console.log("myID:", myId, "otherId:", otherId)

    if (!myId || !otherId) {
        throw new ApiError(404, "All feilds are required.");
    }
    console.log("myId:", myId, "otherId:", otherId)
    let conversation = await Conversation.findOne({
        participents: { $all: [myId, otherId] }
    }).populate("mesages")

    // console.log("conversation:", conversation);


    res.status(200).json(new ApiResponse(200,
        conversation, "conversation get successfully"
    ))
}
)