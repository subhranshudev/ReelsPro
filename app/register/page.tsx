"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      setError("Your password doesnot match");
      throw new Error("Your password doesnot match");
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Registration failed");
      }
      const data = res.json();
      console.log("DATA: ", data);

      router.push("/login");
    } catch (error) {
      setError("Failed to register the user");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="card card-border bg-base-100 w-96 justify-center items-center">
        <div className="card-body flex justify-center items-center">
          <h2 className="card-title text-3xl text-center font-extrabold ">
            Dive into the world of Reels
          </h2>
          <p className="text-xl font-bold"> Sign up to start your journey</p>
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

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Enetr password again
                </legend>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter your email"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </fieldset>
              <button
                className="btn btn-primary w-full mt-4 mb-3"
                type="submit"
              >
                Register
              </button>

              <p>
                Already have an account{" "}
                <Link
                  href="/login"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Login
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

export default Register;
