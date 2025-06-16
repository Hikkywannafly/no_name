import React from 'react'

import { FaUserAlt } from 'react-icons/fa'
type Props = {}

const HeaderUser = (props: Props) => {
    return (
        <div className='bg-gray-800 items-center rounded-full p-3  max-h-[35px]  '>
            <FaUserAlt className='w-8 h-8' />
        </div>
    )
}

export default HeaderUser