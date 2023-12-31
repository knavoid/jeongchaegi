import React from "react";
import { FaRegBell, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState } from "react";
import style from "../styles/PolicyDetail.module.css";

export default function CannotNoticeRegister({shape}) {
  const userData = useSelector((state) => state.user);
  const [open, setOpen] = useState();

  function mouseEnter() {
    setOpen(true);
  }

  function mouseLeave() {
    setOpen(false);
  }

  return (
    <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
      {shape === "Bell" ? <FaRegBell /> : <FaRegBookmark />}
      <div className={`${style.popover_box} ${open ? style.visible : ''}`}>
        <div className={style.popover_header}>주의!</div>
        <div className={style.popover_content}>
          {userData.isLogined
            ? `등록할 수 없는 정책입니다`
            : `로그인이 필요한 서비스입니다`}
        </div>
      </div>
    </div>
  );
}
