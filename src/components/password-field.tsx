'use client'
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

export default function PasswordField(props: {label: string; defaultValue?: string | null}){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="my-4 flex flex-col relative">
            <input required type={showPassword ? "text" : "password"} name={props.label.toLowerCase()} id={props.label.toLowerCase()} className="outline-none border border-gray-400 py-3 pl-3 pr-12 rounded-md peer [&::-ms-reveal]:hidden" defaultValue={props.defaultValue ? props.defaultValue : ""}/>
            <label htmlFor={props.label.toLowerCase()} className="transition-all duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 left-3 bg-white text-gray-400 peer-focus:left-1 peer-focus:px-2 peer-focus:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-valid:left-1 peer-valid:px-2 peer-valid:text-gray-400 peer-valid:top-0 peer-valid:text-sm">{props.label}</label>
            {showPassword ? <Eye size={20} className='absolute top-1/2 -translate-y-1/2 right-4' onClick={() => setShowPassword(false)}/> : <EyeSlash size={20} className='absolute top-1/2 -translate-y-1/2 right-4' onClick={() => setShowPassword(true)}/>}
        </div>
    )
}