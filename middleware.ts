import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // allow auth related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // public
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        return !!token; // This is a double NOT operator (!) used to convert any value to a Boolean (true/false).
                        // If token exists → !!token is true → user is allowed in
                        // If token is null or undefined → !!token is false → user is not allowed
                        // If there's no token, it will block the route and redirect to login (default behavior).
      },
    },
  }
);

export const config = {
    matcher: ["/((?!_next_static|_next/image|favicon.ico|public/).*)"], // Here neagtive lookahead matcher is used, means the middleware will apply 
                                                                        // to all routes except the routes mentioned here
};