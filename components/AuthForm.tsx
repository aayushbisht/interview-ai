"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { setSessionCookie, signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import { UserAuth } from "@/context/AuthContext";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  
  const {logOut, googleSignIn } = UserAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });


  const handleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
  
      const currentUser =  auth.currentUser;
      if (!currentUser) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      console.log(currentUser.uid);
  

   
  
      toast.success("Signed in successfully.");
      router.push("/home");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("There was an error logging in with Google.");
    } finally {
      setLoading(false);
    }
  };
  
 

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(userCredential)

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
    finally{
      setLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="relative">
  {loading && (
    <div className="absolute rounded-2xl inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-[#212328]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 border-solid"></div>
    </div>
  )}

  {/* Auth card */}
  <div className={`card-border lg:min-w-[566px] ${loading ? "pointer-events-none select-none" : ""}`}>
    <div className="flex flex-col gap-6 card py-14 px-10">
      <Link href="/">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo2.jpeg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">SmartPrep</h2>
        </div>
      </Link>
      <div className="flex flex-row gap-2 justify-center">
        <h3>Practice job interviews with AI</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name"
              type="text"
            />
          )}
          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Your email address"
            type="email"
          />
          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
          <Button className="btn" type="submit">
            {isSignIn ? "Sign In" : "Create an Account"}
          </Button>
        </form>
      </Form>
    

      <button onClick={handleSignIn} className="px-4 py-2 bg-blue-600 text-white rounded">
  Continue with Google
</button>


      <p className="text-center">
        {isSignIn ? "No account yet?" : "Have an account already?"}
        <Link
          href={!isSignIn ? "/sign-in" : "/sign-up"}
          className="font-bold text-user-primary ml-1"
        >
          {!isSignIn ? "Sign In" : "Sign Up"}
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default AuthForm;