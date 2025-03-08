import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./lib/mongoose";
import authRouter from "./routers/user.router"
import { ValidateEnv } from "./utils/validate/validate-env";
import { producer } from "./lib/kafka";

dotenv.config();
ValidateEnv()

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());



(async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);

    app.get('/health', (req, res) => res.status(200).send('OK'));
    app.use("/users",authRouter)

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  }
  catch (err) {
    console.log(err)
  }
})()