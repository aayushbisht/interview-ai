"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Form } from "./ui/form"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"



const authFormSchema = (type:FormType) =>{
    return z.object({
        name:type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}


const AuthForm = ({type}:{type:FormType}) => {
  const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email:"",
          password:"",
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type==='sign-up'){
                console.log('Sign up',values)
                toast.success('Account created Successfully. Please sign in')
                router.push('/sign-in')

            }
            else{
                console.log('sign in', values)
                toast.success('Sign in successfull')
                router.push('/sign-in')
            }

        } catch(error){
            console.log(error);
            toast.error( `There was an error:${error}`)
        }
      }  

      const isSignIn = type === 'sign-in';
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
           <div className="flex flex-row gap-1 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} ></Image>
            <h2 className="text-primary-100">SmartPrep</h2>
            <h3>Practice job interview with AI</h3>
           
        </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
        {!isSignIn && (<FormField 
        control = {form.control} 
        name = "name" 
        label="Name"  type = "name" placeholder ="Your Name"/ >)}
        <FormField 
        control = {form.control} 
        name = "email" 
        label="Email" placeholder ="Your Email" type = 'email'/>
        <FormField 
        control = {form.control} 
        name = "password" 
        label="Password"  placeholder ="Your Password" type="password"/>
        <Button type="submit">{isSignIn ? 'Sign In' : 'Sign Up' }</Button>
      </form>
    </Form>
    <p className="text-center">{isSignIn ? 'No Account yet' : 'Have an account already?'}
        <Link href={!isSignIn?'/sign-in':'/sign-up'} className="font-bold text-user-primary ml-1"> {!isSignIn?"Sign In":"Sign Up"}</Link>
    </p>
    </div>
    </div> 

  )
}

export default AuthForm