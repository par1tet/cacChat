import cl from "./TestPage.module.css"

type Props = {}

export default function TestPage({}: Props) {
  return (
    <ul className={cl['test_page_list']}>
      <a href="/sign_up">sign_up</a>
      <a href="/sign_in">sign_in</a>
      <a href="/chats">chats</a>
    </ul>
  )
}