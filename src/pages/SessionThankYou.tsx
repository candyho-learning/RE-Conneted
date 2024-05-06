import { useLocation } from "react-router-dom";
export default function SessionThankYou() {
  const { state } = useLocation();
  const { tasksCompleted, participants, isHost } = state; // Read values passed on state
  return (
    <div className="flex flex-col justify-center bg-brand-yellow py-40 px-20 h-screen">
      <div className="flex space-x-16">
        <p className="w-1/4 font-thin">
          <p className="font-semibold">
            Did you have fun & get some work done?
          </p>
          At Re:Connected, we believe that every session is an opportunity to
          grow and connect. We hope you got some quality work done
        </p>
        <p className="w-1/4 font-thin">
          <p className="font-semibold">Do it again soon!</p>
          RE:Connected sessions are designed to help you work and create bonds.
          <a href="/community" className="underline text-brand-darkgrey">
            {" "}
            Find your next session to join
          </a>{" "}
          or if you feel ready,{" "}
          <a href="/create-session" className="underline text-brand-darkgrey">
            create and host a sesssion
          </a>{" "}
          next!
        </p>
      </div>
      <h1 className="text-9xl font-extrabold mt-16 mr-10">Hey, You Did It!</h1>
      <h4 className="text-3xl text-brand-darkgrey">
        You completed <h4 className="font-bold inline">{tasksCompleted} </h4>
        tasks and connected with{" "}
        <h4 className="font-bold inline">{participants}</h4> friends
      </h4>
      <p className="w-1/4 font-thin self-end mt-16">
        <p className="font-semibold">Thank you so much ❤️ </p>
        ...for {isHost ? "hosting" : "joining"} this session.We hope to see you
        kick ass again in another session at RE:Connected!
      </p>
    </div>
  );
}
