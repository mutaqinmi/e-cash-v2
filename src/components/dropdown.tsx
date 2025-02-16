import { CaretDown } from "@phosphor-icons/react";

export default function Dropdown(props: {label: string; children: React.ReactNode; defaultValue?: string | null}){
    return <div className="my-4 w-full relative">
        <CaretDown className="absolute top-1/2 -translate-y-1/2 right-4"/>
        <select required name={props.label.toLowerCase()} id={props.label.toLowerCase()} className="w-full outline-none border border-gray-400 py-3 px-3 rounded-md [&::-webkit-appearance]:hidden [&::-moz-appearance]:hidden appearance-none" defaultValue={props.defaultValue ? props.defaultValue : props.label.toLowerCase()}>
            <option disabled hidden value={props.label.toLowerCase()}>{props.label}</option>
            {props.children}
        </select>
    </div>
}