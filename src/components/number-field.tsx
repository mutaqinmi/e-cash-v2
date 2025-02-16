export default function NumberField(props: {label: string; defaultValue?: string | null}){
    return (
        <div className="my-4 flex flex-col relative">
            <input required type="number" name={props.label.toLowerCase()} id={props.label.toLowerCase()} className="outline-none border border-gray-400 py-3 px-3 rounded-md peer [&::-webkit-appearance]:hidden [&::-moz-appearance]:hidden appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden" defaultValue={props.defaultValue ? props.defaultValue : ""}/>
            <label htmlFor={props.label.toLowerCase()} className="transition-all duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 left-3 bg-white text-gray-400 peer-focus:left-1 peer-focus:px-2 peer-focus:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-valid:left-1 peer-valid:px-2 peer-valid:text-gray-400 peer-valid:top-0 peer-valid:text-sm">{props.label}</label>
        </div>
    )
}