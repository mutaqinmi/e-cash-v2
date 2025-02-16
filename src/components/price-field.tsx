import { useState } from "react";
import { formatInputtedCurrency } from "../lib/number-formatter";

export default function PriceField(props: {label: string; defaultValue?: string | null}){
    const [value, setValue] = useState<string>(props.defaultValue ?? "");

    return <div className="my-4 flex items-center gap-4 w-full">
        <span className="font-semibold">Rp.</span>
        <div className="flex flex-col relative w-full">
            <input required type="text" name={props.label.toLowerCase()} id={props.label.toLowerCase()} className="outline-none border border-gray-400 py-3 px-3 rounded-md peer" value={value} onChange={(e) => setValue(formatInputtedCurrency(e.currentTarget.value))}/>
            <label htmlFor={props.label.toLowerCase()} className="transition-all duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 left-3 bg-white text-gray-400 peer-focus:left-1 peer-focus:px-2 peer-focus:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-valid:left-1 peer-valid:px-2 peer-valid:text-gray-400 peer-valid:top-0 peer-valid:text-sm">{props.label}</label>
        </div>
    </div>
}