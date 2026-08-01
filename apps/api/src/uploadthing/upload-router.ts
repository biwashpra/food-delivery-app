import { createUploadthing, type FileRouter } from 'uploadthing/express';
import { Request } from 'express';
import type { JwtPayload } from '@food-delivery-app/types';

type RequestWithUser = Request & { user?: JwtPayload };

const f = createUploadthing();

export const uploadRouter: FileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  restaurantImage: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      const authReq = req as RequestWithUser;
      return { uploadedBy: authReq.user?.sub ?? 'unknown' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('upload completed by:', metadata.uploadedBy);
      console.log('File Url:', file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // another routeSlug
  menuItemImages: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      const authReq = req as RequestWithUser;
      return { uploadedBy: authReq.user?.sub ?? 'unknown' };
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
};

export type OurFileRouter = typeof uploadRouter;
