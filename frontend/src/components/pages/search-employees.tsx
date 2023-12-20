import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetDescription,
  // SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// import { Button } from "@/components/ui/button";
import EmployeeSearchForm from "../forms/employee-search-form";
import { Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const SearchEmployees = () => {
  const [searchFields, setSearchFields] = useState({
    searchKeys: [] as string[],
    sortBy: "asc",
    firstName: "",
    lastName: "",
    employeeID: undefined,
    designation: "",
    languageName: "",
    minScore: 0,
    maxScore: 100,
    scoreRange: [0, 100] as [number, number],
  });
  const [isOpened, setIsOpened] = useState(false);
  const [searchParams] = useSearchParams();

  const handleChange = () => {
    if (isOpened) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  useEffect(() => {
    const initialSearchKeys = [];
    const NotSearchKeys = ["minScore", "maxScore", "sortKey", "sortBy"];
    let fields: Record<string, string | number | [number, number]> = {};
    for (let key of Object.keys(searchFields)) {
      let value = searchParams.get(`${key}`);

      if (["minScore", "maxScore"].includes(key)) {
        const min = searchParams.get(`minScore`)
          ? Number(searchParams.get(`minScore`))
          : 0;
        const max = searchParams.get(`maxScore`)
          ? Number(searchParams.get(`maxScore`))
          : 100;
        fields["scoreRange"] = [min, max];
        fields["minScore"] = min;
        fields["maxScore"] = max;
      }
      // console.log(key, value);
      if (value !== null && !NotSearchKeys.includes(key)) {
        // setSearchFields({ ...searchFields, [key]: value });
        fields[key] = value;
        initialSearchKeys.push(key);
      }
    }

    // console.log(initialSearchKeys);
    // console.log(fields);
    setSearchFields({
      ...searchFields,
      ...fields,
      searchKeys: initialSearchKeys,
    });

    document.title = `Filter Employees | ${searchParams.toString()}`;
  }, [searchParams]);

  return (
    <Sheet open={isOpened} onOpenChange={handleChange}>
      <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4">
        {/* <Button variant={"outline"} type="button"> */}
        <Filter className="mr-2 h-4 w-4" />
        Filter
        {/* </Button> */}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Employees</SheetTitle>
          <SheetDescription>
            Make changes to filter employees here. Click filter when you're
            done.
          </SheetDescription>
        </SheetHeader>
        <EmployeeSearchForm
          initialData={searchFields}
          handleClose={handleChange}
        />
      </SheetContent>
    </Sheet>
  );
};

export default SearchEmployees;
