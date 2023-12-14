import { ProgressType } from "@/types";
import { Progress } from "../ui/progress";

const ProgressItem = (props: ProgressType) => {
  const { label, score } = props;
  return (
    <div className="flex w-full items-center">
      <span className="w-16 text-center font-bold mr-1">{label}</span>
      <Progress value={score} className=" min-w-[80px]" />
      <span className="w-16 text-center font-bold ml-1">
        {score.toFixed(0)}%
      </span>
    </div>
  );
};

export default ProgressItem;
