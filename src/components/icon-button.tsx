export default function IconButton(props: {className?: string; icon: React.ReactNode; onClick?: () => void; label?: string; formButton?: boolean}){
    return <button onClick={props.onClick} className={`${props.className} h-full rounded-md bg-blue-500 text-white flex justify-center items-center gap-3 hover:bg-blue-700`} type={props.formButton ? "submit" : "button"}>
        {props.icon}
        {props.label && <span className="text-nowrap">{props.label}</span>}
    </button>

}