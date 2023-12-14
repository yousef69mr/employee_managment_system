import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeType } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AlertModal from "@/components/modals/alert-modal";
import { useState } from "react";
import axios from "axios";
import { apiInstance } from "@/lib/axios";
import { useEmployeeStore } from "@/hooks/use-employee-store";

interface Props {
  data: EmployeeType;
}

const actions = [
  {
    name: "Edit",
    action: "edit",
    icon: <Edit className="h-4 w-4 mr-2" />,
  },
  {
    name: "Copy Id",
    action: "copy",
    icon: <Copy className="h-4 w-4 mr-2" />,
  },
  {
    name: "Delete",
    action: "delete",
    icon: <Trash className="h-4 w-4 mr-2" />,
  },
];
const CellAction = (props: Props) => {
  const { data } = props;
  const onDelete = useEmployeeStore((state) => state.onDelete);
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleAction = (control: string) => {
    switch (control) {
      case "edit":
        handleEdit();
        return;
      case "copy":
        handleCopy();
        return;
      case "delete":
        setOpenAlert(true);
        return;
      default:
        return;
    }
  };

  const handleEdit = () => {
    navigate(`/employees/${data.employeeID}`);
  };

  const handleCopy = () => {
    window.navigator.clipboard
      .writeText(String(data.employeeID))
      .then(() => toast.success(`#${data.firstName} id copied to clipboard `));
  };

  const handleDelete = async () => {
    const cancelToken = axios.CancelToken.source();
    try {
      setDeleting(true);
      const response = await apiInstance.delete(
        `/employees/${data.employeeID}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      if (response.status !== 204) {
        throw new Error(response.statusText);
      }

      onDelete(data.employeeID);
      toast.success(`Employee deleted successfully`);
      navigate("/employees");
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("Request canceled");
      } else {
        toast.error(error as string);
      }
    } finally {
      setDeleting(false);
      setOpenAlert(false);
    }

    return () => {
      cancelToken.cancel();
    };
  };
  const handleCancelDelete = () => {
    setOpenAlert(false);
  };
  return (
    <>
      <AlertModal
        isOpen={openAlert}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        isLoading={deleting}
        type="delete"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {actions.map((action) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={action.name}
              onClick={() => handleAction(action.action)}
            >
              {action.icon}
              {action.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
