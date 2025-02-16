import { useEffect, useState } from "react"

export default function TopBar(){
    const [name, setName] = useState<string>("");

    useEffect(() => {
        const localStorage = typeof window !== undefined ? window.localStorage : null;

        if(localStorage){
            setName(localStorage.getItem("session_user_name") as string);
        }
    }, []);
    
    return <div className="w-screen fixed top-0 left-0 p-4 bg-white flex justify-start pl-72 z-30">
        <div className="flex items-center">
            {name != "" ? <div className="mr-4">Halo, <span className="font-semibold">{name}</span>!</div> : <div className="mr-4 w-48 h-6 rounded-md bg-gray-100"></div>}
        </div>
    </div>
}