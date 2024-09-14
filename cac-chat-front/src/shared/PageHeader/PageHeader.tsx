import { Link } from "react-router-dom"
import cl from "./PageHeader.module.css"

type Props = {
  title: string
}

export default function PageHeader({title}: Props) {
  return (
    <header>
        <div className={cl['container']}>
          <div className={cl["header_row"]}>
            <Link className={cl["header_title"]} to='/'>
              {title}
            </Link>
          </div>
        </div>
      </header>
  )
}