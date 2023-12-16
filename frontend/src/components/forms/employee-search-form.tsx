import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSearchType } from "@/types";
import { employeeSearchOptions, sortDirOptions } from "@/lib/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { EmployeeSearhSchema } from "@/lib/validations/employee";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useForceUpdate } from "@/hooks/use-force-update";

interface Props {
  initialData: EmployeeSearchType | null;
  submitContainer?: ReactNode;
  handleClose?: () => void;
}

type EmployeeFormValues = z.infer<typeof EmployeeSearhSchema>;

const EmployeeSearchForm = (props: Props) => {
  const { initialData, submitContainer, handleClose } = props;

  const navigate = useNavigate();

  const forceUpdate = useForceUpdate();

  const form = useForm<z.infer<typeof EmployeeSearhSchema>>({
    resolver: zodResolver(EmployeeSearhSchema),
    defaultValues: {
      ...initialData,
      employeeID: initialData?.employeeID?.toString() || "",
    },
  });
  const onSubmit = async (values: EmployeeFormValues) => {
    const urlSearchParams = new URLSearchParams();
    // console.log(values.searchKeys);
    for (let key of Object.keys(values) as Array<keyof EmployeeFormValues>) {
      if (values.searchKeys.includes(key) && values[key].toString() !== "") {
        // console.log(key, values[key]);
        urlSearchParams.append(key, values[key].toString());
      }
    }
    if (values.searchKeys.includes("languageName")) {
      urlSearchParams.append("sortKey", values["languageName"].toString());
      urlSearchParams.append("minScore", values["minScore"].toString());
      urlSearchParams.append("maxScore", values["maxScore"].toString());
    }
    if (values["sortBy"] === "desc") {
      urlSearchParams.append("sortBy", values["sortBy"].toString());
    }
    // console.log(window.location.pathname, window.location.search);
    // console.log(urlSearchParams.size, urlSearchParams.toString());
    navigate(`/employees?${urlSearchParams.toString()}`, { replace: true });

    if (handleClose) {
      handleClose();
    }
  };

  const onReset = () => {
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  // useEffect(() => {
  //   forceUpdate();
  // }, [form.getValues().searchKeys]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-x-1">
            <FormField
              control={form.control}
              name="searchKeys"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Filter By</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value.length > 0
                            ? `${
                                employeeSearchOptions.filter((option) =>
                                  field.value.includes(option.value)
                                ).length
                              } options selected`
                            : "Select Option"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search fiter options..." />
                        <CommandEmpty>No Option found.</CommandEmpty>
                        <CommandGroup>
                          {employeeSearchOptions.map((option) => (
                            <CommandItem
                              value={option.value}
                              key={option.value}
                              onSelect={() => {
                                form.setValue(
                                  "searchKeys",
                                  field.value.includes(option.value)
                                    ? field.value.filter(
                                        (v) => v !== option.value
                                      )
                                    : [...field.value, option.value]
                                );
                                forceUpdate();
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(option.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.key}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortBy"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sort Direction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortDirOptions.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          {option.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.getValues().searchKeys.includes("employeeID") && (
            <FormField
              control={form.control}
              name="employeeID"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel>Employee Id</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Employee Id"
                      defaultValue={Number(field.value) ? field.value : ""}
                      // value={isNaN(field.value) ? "" : field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
          )}

          {form.getValues().searchKeys.includes("firstName") && (
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      disabled={isLoading}
                      placeholder="Employee first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
          )}

          {form.getValues().searchKeys.includes("lastName") && (
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      disabled={isLoading}
                      placeholder="Employee last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
          )}
          {form.getValues().searchKeys.includes("designation") && (
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                  <FormLabel>Designation</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      disabled={isLoading}
                      placeholder="ex: Developer, Team Leader, ...etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
          )}
          {form.getValues().searchKeys.includes("languageName") && (
            <>
              <FormField
                control={form.control}
                name="languageName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                    <FormLabel>Language Name</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        disabled={isLoading}
                        placeholder="ex: Java, Perl, ...etc"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minScore"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                    <FormLabel>Min Score</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        disabled={isLoading}
                        type="number"
                        placeholder="min: 0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-x-4 w-full">
                    <FormLabel>Max Score</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        disabled={isLoading}
                        placeholder="max: 100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        {submitContainer ? (
          submitContainer
        ) : (
          <SheetFooter>
            <Button variant={"outline"} type="reset" onClick={onReset}>
              Reset
            </Button>

            <Button type="submit">Search</Button>
          </SheetFooter>
        )}
      </form>
    </Form>
  );
};

export default EmployeeSearchForm;
