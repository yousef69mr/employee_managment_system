import { string, object, array, coerce } from "zod";
import { apiInstance } from "../axios";
import axios from "axios";
import { EmployeeType } from "@/types";


const EmployeeIDValidator = async (value: number) => {
  const url = window.location.href;
  
  const regex = /\/employees\/(\d+)$/;

  // Use the regular expression to extract the <id> value
  const match = url.match(regex);

  // Check if there's a match and get the <id> value
  const employeeId = match ? match[1] : null;


  const cancelToken = axios.CancelToken.source();

  try {
    const employeePromise = await apiInstance.get("/employees", {
      cancelToken: cancelToken.token,
    });

    if (employeePromise.status != 200) {
      throw new Error(employeePromise.statusText);
    }

    const employees: EmployeeType[] = employeePromise.data;
    const takenIds = employees.map((employee) => employee.employeeID);
    
    return !takenIds.includes(value) || Number(employeeId) === value;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error(error);
    } else {
      // alert(error as string);
      return true;
    }
  }

  return () => {
    if (cancelToken) {
      cancelToken.cancel("cancelled");
    }
  };
};

export const EmployeeSchema = object({
  firstName: string().min(1, { message: "First Name is required" }),
  lastName: string().min(1, { message: "Last Name is required" }),
  designation: string().min(1, { message: "Designation is required" }),
  employeeID: coerce
    .number()
    .min(1, { message: "Employee ID is required" })
    .positive({ message: "Employee ID must be more than 0" })
    .refine(EmployeeIDValidator, {
      message: "Id is already taken",
    }),
  knownLanguages: array(
    object({
      languageName: string().min(1, { message: "Language Name is required" }),
      scoreOutof100: coerce
        .number()
        .positive({ message: "Employee ID must be more than 0" })
        .max(100),
    })
  ),
});
