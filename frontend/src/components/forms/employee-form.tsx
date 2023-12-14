import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/helpers/heading";
import { Separator } from "@/components/ui/separator";

import { Loader2, PlusCircle, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
// import AlertModal from "@/components/modals/alert-modal";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSchema } from "@/lib/validations/employee";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
// import ImageUpload from "@/components/ui/image-upload";
import { EmployeeType } from "@/types";
import { apiInstance } from "@/lib/axios";
import AlertModal from "@/components/modals/alert-modal";
import { useEmployeeStore } from "@/hooks/use-employee-store";

interface Props {
  initialData: EmployeeType | null;
}

type EmployeeFormValues = z.infer<typeof EmployeeSchema>;

const EmployeeForm = (props: Props) => {
  const { initialData } = props;
  const onDelete = useEmployeeStore((state) => state.onDelete);

  const navigate = useNavigate();
  const params = useParams();

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      ...initialData,
    },
  });

  useFieldArray({
    control: form.control,
    name: "knownLanguages",
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    // console.log("submit", values);

    const cancelToken = axios.CancelToken.source();
    try {
      let response;
      let successMessage: string;
      if (initialData) {
        response = await apiInstance.put(
          `/employees/${params.employeeId}`,
          values,
          {
            cancelToken: cancelToken.token,
          }
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        successMessage = `Employee updated successfully`;
      } else {
        response = await apiInstance.post(`/employees`, values, {
          cancelToken: cancelToken.token,
        });

        if (response.status !== 201) {
          throw new Error(response.statusText);
        }
        successMessage = `Employee created successfully`;
      }

      toast.success(successMessage);

      navigate(`/employees`);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.error(error);
      } else {
        toast.error(error as string);
      }
    }

    return () => {
      cancelToken.cancel("Operation canceled by the user.");
    };
  };

  const isLoading = form.formState.isSubmitting;

  const [deleting, setDeleting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = async () => {
    const cancelToken = axios.CancelToken.source();
    try {
      setDeleting(true);
      const response = await apiInstance.delete(
        `/employees/${params.employeeId}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      if (response.status !== 204) {
        throw new Error(response.statusText);
      }

      onDelete(Number(params.employeeId));
      toast.success(`Employee deleted successfully`);
      navigate(`/employees`);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.error(error);
      } else {
        toast.error(error as string);
      }
    } finally {
      setDeleting(false);
      setOpenAlert(false);
    }

    return () => {
      cancelToken.cancel("Operation canceled by the user");
    };
  };
  const handleCancelDelete = () => {
    setOpenAlert(false);
  };

  const title = initialData
    ? `Edit Employee #${initialData.employeeID}`
    : "Add Employee";
  const description = initialData
    ? `Edit ${initialData.firstName} ${initialData.lastName}`
    : "Add a new employee";
  const submitBtn = initialData ? "Save Changes" : "Create";
  const submitingText = initialData ? "Saving..." : "Creating...";

  return (
    <>
      <AlertModal
        isOpen={openAlert}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        isLoading={deleting}
        type="delete"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            size={"icon"}
            variant={"destructive"}
            onClick={() => setOpenAlert(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Employee first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Employee last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Employee ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="example: Developer, Manager, ... etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="w-full flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-3xl text-left font-bold tracking-tight">
                Languages
              </h2>
            </div>
            
            <Button
              type="button"
              size={"sm"}
              onClick={() =>
                // languagesInputs.append({ languageName: "", scoreOutof100: 0 })
                form.setValue("knownLanguages", [
                  ...form.getValues().knownLanguages,
                  { languageName: "", scoreOutof100: 0 },
                ])
              }
              className="flex items-center justify-center"
            >
              <PlusCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:block">Add Language</span>
            </Button>
          </div>
          {form.getValues()["knownLanguages"]?.length > 0 && (
            <div className="grid grid-cols-3 gap-8">
              {form.getValues()["knownLanguages"]?.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full max-w-sm items-center space-y-2 md:space-y-0 md:space-x-2  flex-wrap md:flex-nowrap"
                >
                  <FormField
                    control={form.control}
                    name={`knownLanguages.${index}.languageName`}
                    render={() => (
                      <FormItem>
                        <FormLabel>{`Language ${index + 1}`}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="ex: Java, Perl, ... etc"
                            {...form.control.register(
                              `knownLanguages.${index}.languageName`
                            )}
                            defaultValue={item.languageName} // set default value from defaultValues
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`knownLanguages.${index}.scoreOutof100`}
                    render={() => (
                      <FormItem>
                        <FormLabel>{`Score ${index + 1}`}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="example: Developer, Manager, ... etc"
                            type="number"
                            {...form.control.register(
                              `knownLanguages.${index}.scoreOutof100`
                            )}
                            defaultValue={item.scoreOutof100} // set default value from defaultValues
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    size={"icon"}
                    variant={"destructive"}
                    type="button"
                    onClick={() =>
                      form.setValue(
                        "knownLanguages",
                        form
                          .getValues()
                          .knownLanguages.filter((_, i) => i !== index)
                      )
                    }
                    className="self-end"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitingText}
              </>
            ) : (
              submitBtn
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EmployeeForm;
