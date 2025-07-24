import { Router} from "express"
import { getmessage, sendMessage } from "../controller/message.controller.js";
import { IsAuthenticated } from "../middleware/verifyToken.js";



const router=Router();

router.post("/sendMessage/:reciverId",IsAuthenticated,sendMessage);
router.get("/getMessage/:otherId",IsAuthenticated,getmessage);






export default router;