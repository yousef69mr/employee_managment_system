import { string, object, array, coerce } from "zod";

export const EmployeeSchema = object({
  firstName: string().min(1, { message: "First Name is required" }),
  lastName: string().min(1, { message: "Last Name is required" }),
  designation: string().min(1, { message: "Designation is required" }),
  employeeID: coerce
    .number()
    .min(1, { message: "Employee ID is required" })
    .positive({ message: "Employee ID must be more than 0" }),
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
