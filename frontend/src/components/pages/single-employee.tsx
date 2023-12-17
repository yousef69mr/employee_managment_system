import { useEffect, useState } from "react";
import EmployeeForm from "../forms/employee-form";
import { useParams } from "react-router-dom";
import { apiInstance } from "@/lib/axios";
import axios from "axios";
import { EmployeeType } from "@/types";
import Loading from "../loading";
import toast from "react-hot-toast";

const SingleEmployee = () => {
  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const params = useParams();

  const fetchEmployeeData = async (employeeId: string) => {
    const cancelToken = axios.CancelToken.source();

    try {
      const employeePromise = await apiInstance.get(
        `/employees/${employeeId}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      if (employeePromise.status != 200) {
        throw new Error(employeePromise.statusText);
      }

      setEmployee(employeePromise.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error(error);
      } else {
        toast.error(error as string);
      }
    } finally {
      setIsFetching(false);
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("cancelled");
      }
    };
  };
  useEffect(() => {
    if (params.employeeId !== "new") {
      setIsFetching(true);
      fetchEmployeeData(params.employeeId || "");
    }
  }, [params.employeeId]);

  useEffect(() => {
    document.title = employee
      ? `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}  #${
          employee?.employeeID ?? ""
        }`
      : "Add Employee";
  }, [employee]);
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 py-8 pt-6">
        {!isFetching ? <EmployeeForm initialData={employee} /> : <Loading />}
      </div>
    </div>
  );
};

export default SingleEmployee;
