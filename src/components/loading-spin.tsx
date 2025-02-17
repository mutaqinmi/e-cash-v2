export default function LoadingSpin(props: {className?: string}) {
    return (
        <div className={`${props.className} w-10 h-10 border-[6px] border-r-gray-100 border-blue-500 rounded-full animate-spin duration-300`}></div>
    )
}