import express from "express";
import * as userController from "../controllers/user.controller"
import { validate } from "../middleware/validate.middleware";
import { loginInputSchema, registerInputSchema } from "../utils/schemas/user";

const router = express.Router();

router.post("/register", validate(registerInputSchema), userController.signup)
router.post("/login", validate(loginInputSchema), userController.login);
router.get("/verify",userController.getUser)


export default router;

