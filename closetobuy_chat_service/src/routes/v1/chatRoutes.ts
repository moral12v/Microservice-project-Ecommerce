import { Router } from "express";
import ChatController from "../../controller/chatController";
import { customerAuthentication } from "../../middlewares/validateUser";
import { merchantAuthentication } from "../../middlewares/validateMerchant";

const router = Router();

router.get(
  "/history/:receiverId",
  customerAuthentication,
  ChatController.getChatHistory
);

router.get(
  "/merchant-history/:receiverId",
  merchantAuthentication,
  ChatController.getMerchantChatHistory
);

export default router;
