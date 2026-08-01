import { generateReactNativeHelpers } from "@uploadthing/expo";

import type { OurFileRouter } from "../../../api/src/uploadthing/upload-router";

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<OurFileRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: process.env.EXPO_PUBLIC_SERVER_URL,
  });
