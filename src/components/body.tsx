import { useEffect } from "react";
import ErrorSnackbar from "./error-snackbar";
import SuccessSnackbar from "./success-snackbar";
import AddEmployee from "./add-employee";
import * as table from '@/src/db/schema';
import EditEmployee from "./edit-employee";
import EditEmployeePassword from "./edit-employee-password";
import InactiveEmployee from "./inactive-employee";
import AddProduct from "./add-product";
import EditProduct from "./edit-product";
import ArchiveProduct from "./archive-product";
import AddCustomer from "./add-customer";
import EditCustomer from "./edit-customer";
import DeleteCustomer from "./delete-customer";
import TransactionFinished from "./transaction-finished";
import DetailTransaction from "./detail-transaction";
import ArchiveProductList from "./archive-product-list";
import InactiveEmployeeList from "./inactive-employee-list";

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
    showAddProductDialog?: boolean | null;
    setShowAddProductDialog?: (show: boolean | null) => void;
    showEditProductDialog?: boolean | null;
    setShowEditProductDialog?: (show: boolean | null) => void;
    editedProductData?: table.productType | null;
    showArchiveProductDialog?: boolean | null;
    setShowArchiveProductDialog?: (show: boolean | null) => void;
    showAddCustomerDialog?: boolean | null;
    setShowAddCustomerDialog?: (show: boolean | null) => void;
    showEditCustomerDialog?: boolean | null;
    setShowEditCustomerDialog?: (show: boolean | null) => void;
    editedCustomerData?: table.customerType | null;
    showDeleteCustomerDialog?: boolean | null;
    setShowDeleteCustomerDialog?: (show: boolean | null) => void;
    showSuccessfullTransactionDialog?: boolean | null;
    setShowSuccessfullTransactionDialog?: (show: boolean | null) => void;
    transactionData?: table.saleType | null;
    showSaleDetailDialog?: boolean | null;
    setShowSaleDetailDialog?: (show: boolean | null) => void;
    saleDetailID?: number | null;
    showArchivedProductList?: boolean | null;
    setShowArchivedProductList?: (show: boolean | null) => void;
    showInactiveEmployeeList?: boolean | null;
    setShowInactiveEmployeeList?: (show: boolean | null) => void;
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
            {props.showDeleteEmployeeDialog ? <InactiveEmployee popupController={props.setShowDeleteEmployeeDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedEmployeeData!} /> : null}
            {props.showAddProductDialog ? <AddProduct popupController={props.setShowAddProductDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} /> : null}
            {props.showEditProductDialog ? <EditProduct popupController={props.setShowEditProductDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedProductData!} /> : null}
            {props.showArchiveProductDialog ? <ArchiveProduct popupController={props.setShowArchiveProductDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedProductData!} /> : null}
            {props.showAddCustomerDialog ? <AddCustomer popupController={props.setShowAddCustomerDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} /> : null}
            {props.showEditCustomerDialog ? <EditCustomer popupController={props.setShowEditCustomerDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedCustomerData!} /> : null}
            {props.showDeleteCustomerDialog ? <DeleteCustomer popupController={props.setShowDeleteCustomerDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged} data={props.editedCustomerData!} /> : null}
            {props.showSuccessfullTransactionDialog ? <TransactionFinished popupController={props.setShowSuccessfullTransactionDialog} data={props.transactionData!} /> : null}
            {props.showSaleDetailDialog ? <DetailTransaction popupController={props.setShowSaleDetailDialog} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} sale_id={props.saleDetailID!} /> : null}
            {props.showArchivedProductList ? <ArchiveProductList popupController={props.setShowArchivedProductList} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged}/> : null}
            {props.showInactiveEmployeeList ? <InactiveEmployeeList popupController={props.setShowInactiveEmployeeList} successSnackbarController={props.successSnackBarController} errorSnackBarMessage={props.errorSnackBarController} onSuccess={props.onDataChanged}/> : null}
        </div>
    )
}