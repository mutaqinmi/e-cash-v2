import { MagnifyingGlass } from "@phosphor-icons/react";

export default function SearchField(props: {autoFocus?: boolean; placeholder: string; onChange: (value: string) => void}){
    return <div className="w-full relative">
        <input type="text" id="search" name="search" className="peer w-full py-2 px-3 pr-10 bg-gray-100 outline-none border-none rounded-md" placeholder={props.placeholder} autoFocus={props.autoFocus} onChange={(e) => props.onChange(e.currentTarget.value)}/>
        <label htmlFor="search" className="absolute top-1/2 -translate-y-1/2 right-4"><MagnifyingGlass/></label>
    </div>
}