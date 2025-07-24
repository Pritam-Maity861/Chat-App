import { Router} from "express"
import { getme, LoginUser, LogOutUser, registerUser } from "../controller/auth.controller.js";
import { deleteUser, getAllUser, getOtherUser, getSingleUser, updateUser } from "../controller/user.controller.js";
import { IsAuthenticated } from "../middleware/verifyToken.js";
import upload from "../lib/multer.lib.js";


const router=Router();

router.post("/register",registerUser);
router.post("/login",LoginUser);
router.get("/getAllUser",getAllUser);
router.get("/getSingleUser/:id",getSingleUser);
router.delete("/deleteUser/:id",deleteUser);
router.get("/otherUsers",IsAuthenticated,getOtherUser);
router.post("/logOut",LogOutUser);
router.get("/getme",IsAuthenticated,getme);
router.put("/updateProfile",IsAuthenticated,upload.single("avatar"),updateUser);





export default router;