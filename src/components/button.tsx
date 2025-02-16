export default function Button(props: {className?: string; formButton?: boolean; onClick?: () => void; label: string}) {
    return (
        <button type={props.formButton ? "submit" : "button"} className={`${props.className} bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md`} onClick={props.onClick}>{props.label}</button>
    )
}