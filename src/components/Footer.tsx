import { Separator } from "@radix-ui/react-separator";
import Logo from "@/assets/logo-dark.png";

export default function Footer() {
  return (
    <footer className="w-full bottom-0 min-h-min border-t px-32 py-8 justify-between bg-brand-dark text-white">
      <div className="flex justify-between my-10">
        <div>
          <img
            src={Logo}
            alt="Rainbow"
            className="w-40                                                         "
          />

          <h1 className="text-3xl font-bold mb-5">
            Work Remotely, Stay Connected.
          </h1>
          <p>RE:Connected, 2024.</p>
        </div>
        <nav className="flex w-1/4 justify-between 2xl:w-1/5">
          <div className="space-y-3">
            <h4 className="font-bold text-lg">Company</h4>
            <p>About Us</p>

            <p>Careers</p>

            <p>Pricing</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-lg">Resources</h4>
            <p>FAQ</p>
            <p>Blog</p>
            <p>Pricing</p>
          </div>
        </nav>
      </div>
      <Separator className="border-gray-300 border" />
      <div className="flex justify-between mt-10 mb-5">
        <p>
          © 2024 RE:Connected Inc. Made with ❤️‍🔥 and 🐈. All rights reserved.
        </p>
        <ul className="flex space-x-5 text-3xl">
          <li>
            <i className="fa-brands fa-square-facebook"></i>
          </li>
          <li>
            <i className="fa-brands fa-instagram"></i>
          </li>
          <li>
            <i className="fa-brands fa-linkedin"></i>
          </li>
        </ul>
      </div>
    </footer>
  );
}
