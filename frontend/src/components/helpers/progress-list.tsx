import { ProgressType } from "@/types";
import ProgressItem from "./progress-item";

interface Props {
  data: ProgressType[];
}

const ProgressList = (props: Props) => {
  const { data } = props;
  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      {data.length > 0 ? (
        data.map((progress, index) => (
          <ProgressItem
            key={index}
            score={progress.score}
            label={progress.label}
          />
        ))
      ) : (
        <div>No Languages found</div>
      )}
    </div>
  );
};

export default ProgressList;
