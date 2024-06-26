import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import Friends2 from "@/assets/friends2.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import Logo from "@/assets/logo-dark.png";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function Signup() {
  const { createAccount, isLoggedIn } = useContext(AuthContext);
  const [signupForm, setSignupForm] = useState(defaultFormValues);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn]);

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password, firstName, lastName } = signupForm;
    try {
      await createAccount(email, password, firstName, lastName);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        alert("this email has been taken");
      } else if (err.code === "auth/weak-password") {
        alert("Password should be at least 6 characters long.");
      } else {
        alert("something went wrong. please try again");
      }
    }
  }
  return (
    <div className="w-full h-screen bg-brand-mutedblue lg:flex justify-between lg:min-h-[600px] xl:min-h-[800px]">
      <Link to="/" className="absolute top-10 left-10">
        <img
          src={Logo}
          alt="Logo"
          className="w-44 mt-2 mr-40 hover:cursor-pointer"
        />
      </Link>
      <div className="flex items-center justify-center py-12 px-32">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Join RE:Connected</h1>
            <p className="text-balance text-muted-foreground">
              Work alone, together, anywhere in the world.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex space-x-2">
              <div className="grid gap-2">
                <Label htmlFor="email">First Name</Label>
                <Input
                  required
                  type="text"
                  name="firstName"
                  onChange={handleFieldChange}
                  value={signupForm.firstName}
                  placeholder="First Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Last Name</Label>
                <Input
                  required
                  type="text"
                  name="lastName"
                  onChange={handleFieldChange}
                  value={signupForm.lastName}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                type="email"
                name="email"
                onChange={handleFieldChange}
                value={signupForm.email}
                placeholder="hello@re-connected.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                required
                type="password"
                name="password"
                onChange={handleFieldChange}
                value={signupForm.password}
                placeholder="Pick a secure password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign Up (it's free!)
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Log In
            </a>
            <p>
              <a href="/login" className="underline">
                👉🏻 Demo account available
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden bg-brand-mutedblue lg:block w-3/5 ">
        <img
          src={Friends2}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale custom-clip"
        />
      </div>
    </div>
  );
}
