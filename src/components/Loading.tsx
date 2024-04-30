interface LoadingProps {
  hint?: string;
}

export default function Loading({ hint = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center p-40">
      {/* @ts-ignore */}
      <l-waveform size="150" stroke="13" speed="1" color="black"></l-waveform>
      <h4 className="scroll-m-20 text-2xl font-semibold mt-10">{hint}</h4>
    </div>
  );
}
