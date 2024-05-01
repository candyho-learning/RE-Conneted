import Footer from "@/components/Footer";
import Hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo-light.png";

export default function Homepage() {
  return (
    <div className="bg-background">
      <div className="relative">
        <img src={Logo} className="absolute top-10 left-10 w-60" />
        <Link to="/login">
          <Button
            className="absolute top-10 right-10 text-white font-bold text-2xl"
            variant="ghost"
            size="lg"
          >
            Log In
          </Button>
        </Link>

        <img src={Hero}></img>
        <div className="w-1/3 absolute top-44 left-40 text-white">
          <h1 className=" text-8xl font-extrabold leading-tight mb-5">
            Work Remotely, Stay Connected.
          </h1>
          <p className="w-4/5 font-extralight tracking-widest text-lg">
            A community for busy professionals to work, have fun, and connect.
          </p>
          <Link to="/signup">
            <Button className="mt-10 h-16 w-1/2 text-2xl font-semibold">
              JOIN FOR FREE
            </Button>
          </Link>
        </div>
      </div>
      <div></div>
      <Footer />
    </div>
  );
}
