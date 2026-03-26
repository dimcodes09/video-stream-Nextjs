"use client"
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
function LoginPage() {
    const[email,setEmail] = useState("")
    const[password, setPassword]= useState("");
    const[confirmPassword, setConfirmPassword]= useState("")
    const router = useRouter();
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("LOGIN INPUT:", email, password);

  const result = await signIn("credentials", {
    email: email.toLowerCase().trim(),
    password: password.trim(),
    redirect: false,
  });

  if (result?.error) {
    console.log(result.error);
  } else {
    router.push("/");
  }
};
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input 
            type='email'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type='password'
            value={password}
            onChange={(e) =>  setPassword(e.target.value)}
            />
            <button type='submit' >Login</button>
        </form>
        <div>
               Dont have an Account?? 
               <button onClick={() => router.push("/register")}>
                Register
               </button>
                    </div>
    </div>
  )
}

export default LoginPage;