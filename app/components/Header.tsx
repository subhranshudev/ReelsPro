"use client"

import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'


function Header() {
    const {data: session} = useSession()

    const handleSignout = async () => {
        try {
            await signOut()
        } catch (error) {
            throw new Error("Filed to Signout");
            
        }
    }

    return (
      <div>
        <button onClick={handleSignout}>Signout</button>
        {session ? (
          <div>Welcome</div>
        ) : (
          <div>
            <Link href="/login">Login</Link>
            <Link href="/register">SignUp</Link>
          </div>
        )}
      </div>
    );
}

export default Header
