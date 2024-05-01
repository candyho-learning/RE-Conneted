import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import Friends2 from "@/assets/friends2.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function Signup() {
  const { createAccount } = useContext(AuthContext);
  const [signupForm, setSignupForm] = useState(defaultFormValues);
  const navigate = useNavigate();

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("creating an account...");
    const { email, password, firstName, lastName } = signupForm;
    console.log(firstName, lastName);
    createAccount(email, password, firstName, lastName);
    setSignupForm(defaultFormValues);
    navigate("/dashboard");
  }
  return (
    <>
      <div className="w-full h-screen bg-brand-mutedblue lg:flex justify-between lg:min-h-[600px] xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12 px-60">
          <div className="mx-auto grid w-[350px] gap-6">
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
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name: </label>
            <input
              required
              type="text"
              name="firstName"
              onChange={handleFieldChange}
              value={signupForm.firstName}
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              required
              type="text"
              name="lastName"
              onChange={handleFieldChange}
              value={signupForm.lastName}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              required
              type="email"
              name="email"
              onChange={handleFieldChange}
              value={signupForm.email}
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              required
              type="password"
              name="password"
              onChange={handleFieldChange}
              value={signupForm.password}
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
}
