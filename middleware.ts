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




// How withAuth Actually Works (Important Flow)
// When you use withAuth, it does two things:
// 1. Calls your authorized callback first to check if the request should proceed.
// 2. If authorized returns:
// true → it runs your middleware function (if provided)
// false → it blocks the request immediately (without running your middleware function) and redirects (or returns 401)

//  handled public routes first
//  Then, with "return !!token;" at the end, easily protected everything else by default

// withAuth with token --> 
// It decodes the token
// It validates its signature and expiry
// If valid → it makes the token available to you via token in authorized callback. (validation occurs internally)
// If invalid (expired, malformed, wrong secret) → token will be null

// withAuth reads, decodes, and validates the token for you internally.
// You only need to check if token exists in your authorized callback to control access.

// withAuth doesn’t check custom properties inside the token (like token.role), you’d have to do that yourself if needed.