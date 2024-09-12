import React from 'react'
import "./PageHeader.css"

type Props = {
  title: string
}

export default function PageHeader({title}: Props) {
  return (
    <header>
        <div className='container'>
          <div className="header_row">
            <a className="header_title" href='/'>
              {title}
            </a>
          </div>
        </div>
      </header>
  )
}