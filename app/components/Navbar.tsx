"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Home } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
          <div className="flex mr-2 justify-center items-center">
            <Home />
            ReelsRush
          </div>
        </Link>

        {session ? (
          <>
            <span className="mr-4">Welcome, {user.email} </span>
            <div>
              <Link href="/upload">
                <button className="btn btn-success">Upload</button>
              </Link>
              <button className="btn btn-info ml-2" onClick={() => signOut()}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <span>Want to upload videos?, Login</span>
            <Link href="/signin">
              <button className="btn">Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
