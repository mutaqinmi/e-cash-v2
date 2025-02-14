export default function SidebarMenuItem(props: {icon: React.ReactNode, title: string, onClick: () => void, active?: boolean}) {
    return <div className={`${props.active ? "px-4 bg-gray-100 border-l-8 border-blue-500" : "px-0 bg-white border-l-none"} flex gap-4 items-center cursor-pointer py-3 rounded-l-lg`} onClick={props.onClick}>
        {props.icon}
        <span>{props.title}</span>
    </div>
}