import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EmployeeType } from "@/types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";

export type EmployeeColumnDef<TData> = ColumnDef<TData> & {
  type: string; // Replace 'string' with the actual type you want to use
};

export const EmployeeColumns: EmployeeColumnDef<EmployeeType>[] = [
  {
    accessorKey: "employeeID",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employee ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    type: "number",
    // cell: ({ row }) => <div>{row.original.employeeID.toString()}</div>,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
  },
  {
    accessorKey: "designation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Designation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
  },
  {
    accessorKey: "knownLanguages",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Known Languages
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const knownLanguages = row.original.knownLanguages;

      const customizedKnownLanguages = knownLanguages?.map((language) => ({
        label: language.languageName,
        score: language.scoreOutof100,
      }));
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div>{knownLanguages?.length}</div>
            </TooltipTrigger>
            <TooltipContent>
              <ProgressList data={customizedKnownLanguages} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    type: "number",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    type: "action",
  },
];
