'use client'
import Button from "@/src/components/button";
import Container from "@/src/components/container";
import InputField from "@/src/components/input-field";
import PasswordField from "@/src/components/password-field";
import Form from "next/form";
import { useCallback, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Loading from "@/src/components/loading";
import Body from "@/src/components/body";
import { create } from "zustand";
import { useRouter } from "next/navigation";

interface ComponentState {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
}

const useComponent = create<ComponentState>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message}))
}));

export default function Page() {
    const {errorSnackBarMessage, setErrorSnackBarMessage, successSnackBarMessage, setSuccessSnackBarMessage} = useComponent();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const authUser = useCallback(async (formData: FormData) => {
        return await axios.post(`${process.env.API_URL}/auth/signin`, {
            username: formData.get('username'),
            password: formData.get('password')
        }).then((response: AxiosResponse) => {
            if(response.status === 200){
                setSuccessSnackBarMessage('Login berhasil!');
                const localStorage = window.localStorage;
                localStorage.setItem('session_user_name', response.data.data.name);
                localStorage.setItem('session_user_role', response.data.data.role);

                response.data.data.role === "Administrator" ? router.push("/admin") : router.push("/cashier");
            }
        }).catch((error: AxiosError) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const signInHandler = (formData: FormData) => {setIsLoading(true); authUser(formData)};

    return isLoading ? <Loading/> : <Body className="h-screen w-screen flex justify-center items-center" errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarMessage={successSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage}>
        <Container className="w-96 bg-white shadow-md rounded-lg p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">Masuk</h1>
                <span>Masuk untuk melanjutkan.</span>
            </div>
            <Form action={signInHandler} formMethod="POST">
                <InputField label="Username"/>
                <PasswordField label="Password"/>
                <Button formButton label="Masuk" className="w-full mt-8"/>
            </Form>
        </Container>
    </Body>
}