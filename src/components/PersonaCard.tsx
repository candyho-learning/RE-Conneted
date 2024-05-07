import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PersonaCardProps {
  img: string;
  title: string;
  description: string;
}

export default function PersonaCard({
  img,
  title,
  description,
}: PersonaCardProps) {
  return (
    <Card className="w-80 h-96 rounded-none pb-8 text-brand-dark">
      <img src={img} className="h-2/3 w-full object-cover"></img>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        <CardDescription className="font-normal text-sm">
          ...{description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
