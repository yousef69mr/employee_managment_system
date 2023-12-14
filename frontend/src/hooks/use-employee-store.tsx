import { EmployeeType } from "@/types";
import { create } from "zustand";

interface EmployeeStore {
  employees: EmployeeType[];
  onDelete: (employeeId: number) => void;
  onAdd: (employees: EmployeeType[]) => void;
  onOverwrite: (employee: EmployeeType[]) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  onDelete: (employeeId) =>
    set((state) => {
      const newData = state.employees.filter(
        (employee) => employeeId !== employee.employeeID
      );
      return { employees: [...newData] };
    }),
  onAdd: (employees) =>
    set((state) => ({
      employees: [...state.employees, ...employees],
    })),
  onOverwrite: (employees) =>
    set({
      employees,
    }),
}));
