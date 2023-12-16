import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { apiInstance } from "@/lib/axios";
import EmployeeTable from "@/components/tables/employees/employee-table";
import { Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useEmployeeStore } from "@/hooks/use-employee-store";
import SearchEmployees from "./search-employees";
import toast from "react-hot-toast";

const Employees = () => {
  const { onOverwrite, employees } = useEmployeeStore();
  //   const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

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

  const fetchFilteredEmployeesData = async () => {
    const cancelToken = axios.CancelToken.source();

    try {
      // console.log(searchParams.toString())
      const employeePromise = await apiInstance.get(
        `/employees/search?${searchParams.toString()}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      // console.log(employeePromise)
      if (employeePromise.status != 200) {
        throw new Error(employeePromise.statusText);
      }

      onOverwrite(employeePromise.data);
    } catch (error: AxiosError | any) {
      if (axios.isCancel(error)) {
        console.error(error);
      } else {
        // console.log(error);
        if (typeof error === "object") {
          if (error?.response?.data && Array.isArray(error.response.data)) {
            onOverwrite(error.response.data);
          }
        } else {
          toast.error(`Server error!`);
        }
      }
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("cancelled");
      }
    };
  };
  useEffect(() => {
    if (searchParams.size > 0) {
      fetchFilteredEmployeesData();
    } else {
      fetchEmployeesData();
    }

    // console.log(searchParams)
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 justify-between space-y-4 py-8 pt-6">
        <Heading
          title={`Employees (${employees?.length})`}
          description="Manage employees for your system"
        />
        <div className="flex gap-x-1">
          <SearchEmployees />
          <Button onClick={() => navigate(`/employees/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      <Separator />
      <EmployeeTable employees={employees} />
    </div>
  );
};

export default Employees;
