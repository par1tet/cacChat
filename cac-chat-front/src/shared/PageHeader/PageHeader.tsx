import cl from "./PageHeader.module.css"

type Props = {
  title: string
}

export default function PageHeader({title}: Props) {
  return (
    <header>
        <div className={cl['container']}>
          <div className={cl["header_row"]}>
            <a className={cl["header_title"]} href='/'>
              {title}
            </a>
          </div>
        </div>
      </header>
  )
}