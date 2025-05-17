import React from 'react'
function Footer() {
const date = new Date();
const year = date.getFullYear();
  return (
    <div className='text-center py-4'> <p className='text-center py-1'>Copyright © {year}  KGGL. All Right Reserved.</p>
     </div>
  )
}


export default Footer
