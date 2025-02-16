export default function OutlinedButton(props: {className?: string; formButton?: boolean; onClick?: () => void; label: string}) {
    return (
        <button type={props.formButton ? "submit" : "button"} className={`${props.className} bg-white text-blue-500 p-3 rounded-md border border-blue-500 hover:text-blue-700 hover:border-blue-700`} onClick={props.onClick}>{props.label}</button>
    )
}