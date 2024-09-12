import React from 'react'
import "./TestPage.css"

type Props = {}

export default function TestPage({}: Props) {
  return (
    <ul className='test_page_list'>
      <a href="/sign_up">sign_up</a>
      <a href="/sign_in">sign_in</a>
    </ul>
  )
}