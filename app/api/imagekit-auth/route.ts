// import ImageKit from "imagekit";
// import { NextResponse } from "next/server";

// // backend requires SDK requires publicKey, privateKey, urlEndpoint
// const imagekit = new ImageKit({
//   publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
//   privateKey: process.env.PRIVATE_KEY!,
//   urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
// });

// export async function GET() {
//   try {
//     // get authentication parameters required for file uploading
//     const authenticationParameters = imagekit.getAuthenticationParameters();
//     return NextResponse.json(authenticationParameters);
//   } catch (error) {
//     return NextResponse.json({ error: "ImageKit Auth Error" }, { status: 500 });
//   }
// }

// New Version-->

import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    return NextResponse.json({ error: "ImageKit Auth Error" }, { status: 500 });
  }
}
