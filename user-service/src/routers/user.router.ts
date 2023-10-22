import express from "express";
import * as userController from "../controllers/user.controller"
import { validate } from "../middleware/validate.middleware";
import { registerInputSchema } from "../utils/schemas/user";

const router = express.Router();

// router.use(authController.parseAuthCookie, authController.protectRoutes);

// router.patch("/update-password", userController.updatePassword);

// router.patch("/reject-friend-request", userController.rejectFriendRequest);

router.post("/register", validate(registerInputSchema), userController.signup)

// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .patch(
//     userController.uploadProfileImage,
//     resizeImage("users"),
//     userController.updateUserProfile
//   );

export default router;

