import { useEffect } from "react";
import ErrorSnackbar from "./error-snackbar";
import SuccessSnackbar from "./success-snackbar";

export default function Body(props: {
    children: React.ReactNode;
    errorSnackBarMessage?: string | null;
    errorSnackBarController?: (message: string | null) => void;
    successSnackBarMessage?: string | null;
    successSnackBarController?: (message: string | null) => void;
}){
    useEffect(() => {
        if (props.errorSnackBarMessage != null && props.successSnackBarMessage) {
            props.errorSnackBarController!(null);
        } else if(props.successSnackBarMessage != null && props.errorSnackBarMessage){
            props.successSnackBarController!(null);
        }
    }, [props.errorSnackBarMessage, props.successSnackBarMessage]);

    return (
        <>
            {props.children}
            { props.errorSnackBarMessage ? <ErrorSnackbar message={props.errorSnackBarMessage} snackbarController={props.errorSnackBarController} /> : null }
            { props.successSnackBarMessage ? <SuccessSnackbar message={props.successSnackBarMessage} snackbarController={props.successSnackBarController} /> : null }
        </>
    )
}