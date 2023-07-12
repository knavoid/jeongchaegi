import React from 'react'
import nav_styles from "../styles/Nav.module.css"
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <div className={nav_styles.nav_wrap}>
      <div className={nav_styles.nav_menu}>
        <Link to={"/"} className={nav_styles.nav_logo}></Link>
        <div>정책list </div>
        <div>calendar</div>
      </div>
      <div>
        Login
      </div>
    </div>
  )
}
