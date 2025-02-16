import { useEffect } from "react";
import ErrorSnackbar from "./error-snackbar";
import SuccessSnackbar from "./success-snackbar";
import AddEmployee from "./add-employee";
import * as table from '@/src/db/schema';
import EditEmployee from "./edit-employee";
import EditEmployeePassword from "./edit-employee-password";
import DeleteEmployee from "./delete-employee";

export default function Body(props: {
    className?: string;
    children: React.ReactNode;
    onDataChanged?: () => void;
    errorSnackBarMessage?: string | null;
    errorSnackBarController?: (message: string | null) => void;
    successSnackBarMessage?: string | null;
    successSnackBarController?: (message: string | null) => void;
    showAddEmployeeDialog?: boolean | null;
    setShowAddEmployeeDialog?: (show: boolean | null) => void;
    showEditEmployeeDialog?: boolean | null;
    setShowEditEmployeeDialog?: (show: boolean | null) => void;
    showEditEmployeePasswordDialog?: boolean | null;
    setShowEditEmployeePasswordDialog?: (show: boolean | null) => void;
    editedEmployeeData?: table.employeeType | null;
    showDeleteEmployeeDialog?: boolean | null;
    setShowDeleteEmployeeDialog?: (show: boolean | null) => void;
}){
    useEffect(() => {
        if (props.errorSnackBarMessage != null && props.successSnackBarMessage) {
            props.errorSnackBarController!(null);
        } else if(props.successSnackBarMessage != null && props.errorSnackBarMessage){
            props.successSnackBarController!(null);
        }
    }, [props.errorSnackBarMessage, props.successSnackBarMessage]);

    return (
        <div className={props.className}>
            {props.children}
            {props.errorSnackBarMessage ? <ErrorSnackbar message={props.errorSnackBarMessage} snackbarController={props.errorSnackBarController} /> : null}
            {props.successSnackBarMessage ? <SuccessSnackbar message={props.successSnackBarMessage} snackbarController={props.successSnackBarController} /> : null}
            {props.showAddEmployeeDialog ? <AddEmployee popupController={props.setShowAddEmployeeDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} /> : null}
            {props.showEditEmployeeDialog ? <EditEmployee popupController={props.setShowEditEmployeeDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedEmployeeData!} /> : null}
            {props.showEditEmployeePasswordDialog ? <EditEmployeePassword popupController={props.setShowEditEmployeePasswordDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedEmployeeData!} /> : null}
            {props.showDeleteEmployeeDialog ? <DeleteEmployee popupController={props.setShowDeleteEmployeeDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedEmployeeData!} /> : null}
        </div>
    )
}