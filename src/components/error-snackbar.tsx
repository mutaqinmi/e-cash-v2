import { X } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function ErrorSnackbar(props: {message: string; snackbarController?: (message: string | null) => void}){
    useEffect(() => {
        const setSnackBarInterval = setInterval(() => {
            props.snackbarController!(null);
        }, 5000);

        return () => clearInterval(setSnackBarInterval);
    }, [props.message, props.snackbarController]);

    return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md flex items-center gap-4 z-[60]">
            {props.message}
            <X onClick={() => props.snackbarController!(null)} className="text-white"/>
        </div>
    )
}