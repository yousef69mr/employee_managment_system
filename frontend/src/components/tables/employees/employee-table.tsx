import { DataTable } from "@/components/ui/data-table";
import { EmployeeType } from "@/types";
import { EmployeeColumns } from "./columns";

interface Props {
  employees: EmployeeType[];
}

const EmployeeTable = (props: Props) => {
  const { employees } = props;
  return (
    <div className="w-full">
      <DataTable
        data={employees}
        columns={EmployeeColumns}
        initialSearchKey="designation"
      />
    </div>
  );
};

export default EmployeeTable;
