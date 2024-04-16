import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function Signup() {
  const { createAccount } = useContext(AuthContext);
  const [signupForm, setSignupForm] = useState(defaultFormValues);

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
  }
  return (
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
  );
}
