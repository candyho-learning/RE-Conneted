import Footer from "@/components/Footer";
import Hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo-light.png";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import ConnectionsImg from "@/assets/connection.png";
import ConcentrationImg from "@/assets/concentration.png";
import features from "@/assets/features.png";
import PersonaCard from "@/components/PersonaCard";
import Persona1 from "@/assets/persona1.png";
import Persona2 from "@/assets/persona2.png";
import Persona3 from "@/assets/persona3.png";

export default function Homepage() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  return (
    <div className="bg-background">
      <div className="relative h-screen">
        <img src={Logo} className="absolute top-10 left-10 w-60" />
        {!isLoggedIn && (
          <Link to="/login">
            <Button
              className="absolute top-10 right-10 text-white font-bold text-2xl"
              variant="ghost"
              size="lg"
            >
              <h4>Log In</h4>
            </Button>
          </Link>
        )}

        {isLoggedIn && user && (
          <div className="flex items-center absolute top-10 right-10">
            <h4 className="text-lg text-white font-bold tracking-wide mr-3">
              Welcome Back, {user.firstName}!
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full "
                >
                  <UserAvatar />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/create-session">
                  <DropdownMenuLabel>Create a Session</DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/dashboard">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    My Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Profile Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="hover:cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <img src={Hero} className="h-full w-full object-cover"></img>
        <div className="w-1/3 absolute top-32 left-40 text-white 2xl:top-44">
          <h1 className="text-6xl font-extrabold leading-relaxed mb-5 xl:text-8xl xl:leading-snug 2xl:text-[6.8rem]">
            Work Remotely, Stay Connected.
          </h1>
          <p className="w-4/5 font-extralight tracking-widest text-lg">
            A community for busy professionals to work, have fun, and connect.
          </p>

          <Link to="/signup">
            <Button className="mt-10 h-16 w-1/2 text-lg font-semibold lg:text-xl xl:text-2xl">
              JOIN FOR FREE
            </Button>
          </Link>
        </div>
      </div>

      <main className=" text-brand-dark relative">
        <section className="flex flex-col items-center py-32">
          <h2 className="text-6xl font-bold mb-16">RE:Connected is for...</h2>
          <div className="flex space-x-10">
            <PersonaCard
              img={Persona1}
              title="Busy Friends"
              description="who want to work together and catch up"
            />
            <PersonaCard
              img={Persona2}
              title="Remote Workers"
              description="who seek productivity and mental well-being in a supportive community"
            />
            <PersonaCard
              img={Persona3}
              title="Professionals"
              description="who value meaningful connections & professional growth in a digital age"
            />
          </div>
          <p className="mt-16">
            and everyone who struggles to balance maintaining connections and
            doing quality work in their free time.
          </p>
          <p></p>
        </section>
        <section className="bg-brand-yellow px-40 py-20">
          <h2 className="text-4xl font-bold text-center tracking-wide italic">
            Short, focused co-working sessions <br />
            to help you work and create bonds.
          </h2>
        </section>
        <section className="flex py-16 justify-between my-20 px-28 2xl:px-60">
          <div className="shrink-0">
            <img src={ConcentrationImg}></img>
          </div>
          <div className="w-3/5 flex flex-col justify-between ml-20">
            <h2 className="text-6xl font-bold">Concentration</h2>
            <p className="w-4/5 text-2xl text-brand-darkgrey">
              <strong>Each RE:Connected session comes with</strong> built-in
              productivity tools to help you focus and do deep work in a short
              period of time.
            </p>
            <p className="w-4/5 font-thin">
              At Re:Connected, we understand the value of deep focus and
              concentration. Our platform is designed to help you achieve a
              state of flow, where distractions fade away, and productivity
              soars.
            </p>
          </div>
        </section>

        <section className="flex py-16 justify-between my-20 px-28 2xl:px-60 ">
          <div className="w-3/5 flex flex-col justify-between mr-20">
            <h2 className="text-6xl font-bold">+ Connection</h2>
            <p className="w-4/5 text-2xl text-brand-darkgrey">
              <strong>Join a vibrant community</strong> of like-minded
              professionals who are all dedicated to improving their work-life
              balance.
            </p>
            <p className="w-4/5 font-thin">
              Whether you're looking to expand your professional network or
              simply meet new friends, Re:Connected provides the perfect
              platform to make meaningful connections in a digital age.
            </p>
          </div>
          <div className="shrink-0">
            <img src={ConnectionsImg}></img>
          </div>
        </section>
        <section className="flex py-16 justify-between mt-20 px-28 2xl:px-60">
          <div className="shrink-0 bg-brand-mutedblue px-10 py-20 w-1/2">
            <img src={features}></img>
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center">
            <h2 className="text-6xl font-bold">Key Features</h2>
            <p className="tracking-widest text-md">
              THAT HELP YOU FOCUS AND CONNECT
            </p>
            <ul className="mt-10">
              <li className="border-b text-brand-dark border-brand-darkgrey py-8 px-20 text-center text-xl">
                Video Calling
              </li>
              <li className="border-b text-brand-dark border-brand-darkgrey py-8 px-20 text-center text-xl">
                Instant Messaging
              </li>
              <li className="border-b text-brand-dark border-brand-darkgrey py-8 px-20 text-center text-xl">
                Focus Timers
              </li>
              <li className="border-b text-brand-dark border-brand-darkgrey py-8 px-20 text-center text-xl">
                Session To-Do Lists
              </li>
              <li className="py-8 px-20 text-center text-xl">Community</li>
            </ul>
          </div>
        </section>
        <Button
          className="absolute bottom-5 right-5"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          size="icon"
          variant="outline"
        >
          <i className="fa-solid fa-angles-up"></i>
        </Button>
      </main>
      <div></div>
      <Footer />
    </div>
  );
}
