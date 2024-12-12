import React from 'react'

const PasswordInput = (props) => {

  return (
    <div className='flex items-center bg-transparent border-[1.5px] rounded mb-3'>
        <input 
        value={props.value}
        onChange={props.onChange} 
        type={"password"} 
        placeholder={props.placeholder || "Password" }
        className='w-full text-sm bg-transparent p-3 mr-3 rounded outline-none'
        />
    </div>
  )
}

export default PasswordInput