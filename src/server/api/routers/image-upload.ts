import { v2 } from "cloudinary";

import {
  consumerProcedure,
  createTRPCRouter,
  publicProcedure,
  vendorProcedure,
} from "@/server/api/trpc";

export const imageUploadRouter = createTRPCRouter({
  signedURL: publicProcedure.query(() => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const api_secret = process.env.CLOUDINARY_API_SECRET!;

    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret,
      secure: true,
    });

    const signature = v2.utils.api_sign_request(
      { timestamp, folder: `candies` },
      // { timestamp, folder: `${process.env.CLOUDINARY_FOLDER_NAME!}/candies` },
      api_secret
    );
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME!}/image/upload`;

    return {
      // folder: process.env.CLOUDINARY_FOLDER_NAME!,
      folder: 'candies',
      api_key: process.env.CLOUDINARY_API_KEY!,
      url,
      signature,
      timestamp,
    };
  }),
});
