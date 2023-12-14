import { useEffect, useState } from "react";
import axios from "axios";
import { apiInstance } from "@/lib/axios";
import EmployeeTable from "@/components/tables/employees/employee-table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useEmployeeStore } from "@/hooks/use-employee-store";

const Employees = () => {
  const { onOverwrite, employees } = useEmployeeStore();
  //   const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployeesData = async () => {
    const cancelToken = axios.CancelToken.source();

    try {
      const employeePromise = await apiInstance.get("/employees", {
        cancelToken: cancelToken.token,
      });

      if (employeePromise.status != 200) {
        throw new Error(employeePromise.statusText);
      }

      onOverwrite(employeePromise.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error(error);
      } else {
        alert(error as string);
      }
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("cancelled");
      }
    };
  };
  useEffect(() => {
    fetchEmployeesData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`Employees (${employees?.length})`}
          description="Manage employees for your system"
        />
        <Button onClick={() => navigate(`/employees/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <EmployeeTable employees={employees} />
    </div>
  );
};

export default Employees;
