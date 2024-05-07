import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import friends from "@/assets/friends.jpg";

export default function PersonaCard() {
  return (
    <Card className="w-80 h-96 rounded-none">
      <img src={friends} className="h-2/3 w-full object-cover"></img>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Busy Friends</CardTitle>
        <CardDescription>
          ...who want to work together and catch up
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
