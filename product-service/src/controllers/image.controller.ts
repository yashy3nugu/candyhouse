import { NextFunction, Request, Response } from 'express';
import { v2 } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@/config';

export class ImageController {
  public signedUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const api_secret = CLOUDINARY_API_SECRET;

      v2.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret,
        secure: true,
      });

      const signature = v2.utils.api_sign_request(
        { timestamp, folder: `candies` },
        // { timestamp, folder: `${process.env.CLOUDINARY_FOLDER_NAME!}/candies` },
        api_secret,
      );
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

      res.send({
        // folder: process.env.CLOUDINARY_FOLDER_NAME!,
        folder: 'candies',
        api_key: CLOUDINARY_API_KEY,
        url,
        signature,
        timestamp,
      });
    } catch (error) {
      next(error);
    }
  };
}
