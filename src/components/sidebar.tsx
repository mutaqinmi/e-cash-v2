import Image from "next/image";
import HorizontalDivider from "./horizontal-divider";
import SidebarMenuItem from "./sidebar-menu-item";
import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import OutlinedButton from "./outlined-button";
import Button from "./button";

export default function Sidebar(props: {children: React.ReactNode}){
    const router = useRouter();
    const [role, setRole] = useState<string>("");
    const [showSignoutDialog, setShowSignoutDialog] = useState<boolean>(false);

    const authUser = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/auth/signout`).then((response: AxiosResponse) => {
            if(response.status === 200){
                router.push("/signin");
            }
        }).catch((error: AxiosError) => {
            const { message } = error.response?.data as { message: string };
        });
    }, []);

    const signOutHandler = () => authUser();

    useEffect(() => {
        const localStorage = typeof window !== undefined ? window.localStorage : null;

        if(localStorage){
            setRole(localStorage.getItem("session_user_role") as string);
        }
    }, [])

    return <div className="h-screen w-64 bg-white fixed top-0 left-0 flex flex-col justify-between z-40">
        {showSignoutDialog ? <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-black bg-opacity-25 flex justify-center items-center">
            <div className="w-[25rem] p-4 bg-white rounded-md relative">
                <h1 className="text-xl font-semibold">Keluar?</h1>
                <span className="my-4 block">Apakah anda yakin untuk keluar? Anda dapat masuk kembali melalui halaman masuk.</span>
                <div className="mt-4 flex justify-end items-center gap-2">
                    <OutlinedButton className="py-2" label="Batal" onClick={() => setShowSignoutDialog(false)}></OutlinedButton>
                    <Button className="py-2 bg-red-500 hover:bg-red-700" label="Keluar" onClick={signOutHandler}></Button>
                </div>
            </div>
        </div> : null}
        <div>
            <div className="m-4 p-4 flex justify-center items-center gap-2 bg-blue-100 rounded-lg">
                <Image width={0} height={0} src={"/logo.png"} unoptimized alt="Logo" className="w-10"/>
                <div className="flex flex-col justify-center">
                    <h1 className="font-semibold text-lg tracking-widest leading-5">E - Cash</h1>
                    <span className="text-xs tracking-wide leading-5">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
            </div>
            <div className="mr-0 mt-8 m-4 flex flex-col gap-2">
                {props.children}
            </div>
        </div>
        <div className="m-4 flex flex-col gap-2">
            <HorizontalDivider/>
            <SidebarMenuItem icon={<SignOut/>} title="Keluar" onClick={() => setShowSignoutDialog(true)}/>
        </div>
    </div>
}