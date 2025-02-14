import Image from "next/image";
import HorizontalDivider from "./horizontal-divider";
import SidebarMenuItem from "./sidebar-menu-item";
import { SignOut } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function Sidebar(props: {children: React.ReactNode}){
    const pathname = usePathname();
    const router = useRouter();

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

    return <div className="h-screen w-64 bg-white fixed top-0 left-0 flex flex-col justify-between z-50">
        <div>
            <div className="m-4 p-4 flex justify-center items-center gap-2 bg-blue-100 rounded-lg">
                <Image width={0} height={0} src={"/logo.png"} unoptimized alt="Logo" className="w-10"/>
                <div className="flex flex-col justify-center">
                    <h1 className="font-semibold text-lg tracking-widest leading-5">E - Cash</h1>
                    <span className="text-xs tracking-wide leading-5">{pathname.includes("admin") ? "Administrator" : "Cashier"}</span>
                </div>
            </div>
            <div className="mr-0 mt-8 m-4 flex flex-col gap-2">
                {props.children}
            </div>
        </div>
        <div className="m-4 flex flex-col gap-2">
            <HorizontalDivider/>
            <SidebarMenuItem icon={<SignOut/>} title="Keluar" onClick={() => signOutHandler()}/>
        </div>
    </div>
}