import React from 'react'
import Brand from '../brand/Brand'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className='flex items-center justify-between px-4 py-3 '>
      <Brand />
      <ul className='flex items-center text-gray-400 gap-4'>
        <li><a href="#">How it Work</a></li>
        <li><a href="#">Browse tasks</a></li>
        <li><a href="#">Top workers</a></li>
      </ul>
      <ul className='flex items-center gap-4'>
        <Link href='/login' className='text-black font-semibold ' >Log in</Link>
        <Link href='/register' className='bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2'>Get started <span className=''><ArrowUpRight /></span> </Link>
      </ul>
    </nav>
  )
}

export default Navbar