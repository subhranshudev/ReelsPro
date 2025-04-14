"use client"

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


      const router = useRouter();

       const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();

         if (!email || !password) {
          throw new Error("All fields are required");
          
         }

         const result = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password
         })

         if (result?.error) {
            if (result.error === "CredentialsSignin") {
                throw new Error("Login Failed");
                
            } else {
                throw new Error("Login Failed");
            }
         }

         if(result?.url) {
            router.replace("/")
         }
         
       };


    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="card card-border bg-base-100 w-96 justify-center items-center">
          <div className="card-body flex justify-center items-center">
            <h2 className="card-title text-3xl text-center font-extrabold ">
              Dive into the world of Reels
            </h2>
            <p className="text-xl font-bold"> Sign in to start your journey</p>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Password</legend>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </fieldset>

                <button
                  className="btn btn-primary w-full mt-4 mb-3"
                  type="submit"
                >
                  Login
                </button>

                <p>
                 Don't have an account{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    SignUp
                  </Link>
                </p>
              </form>
            </div>

            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
    );
}

export default Login
