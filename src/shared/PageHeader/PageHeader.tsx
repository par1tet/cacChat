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
            <p className="header_title">
              {title}
            </p>
          </div>
        </div>
      </header>
  )
}