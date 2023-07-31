import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import style from "../styles/policylist.module.css";
import Nav from "../components/Nav";
import PcyListItem from "../components/PcyListItem";
import PolicyListSearch from "../components/PolicyListSearch";
import PolicyFilter from "../components/PolicyFilter";
import PolicyListCalendar from "../components/PolicyListCalendar";
import PolicyListSort from "../components/PolicyListSort";

export default function PolicyList() {
  const router = useRouter();
  const { calendarActive, calendarDate } = router.query;

  // State 모음
  const [isCalendarActive, setIsCalendarActive] = useState(
    Boolean(calendarActive)
  );
  const [targetDate, setTargetDate] = useState(new Date());
  const [testdata, settest] = useState("");

  // 변수 모음

  // 더미 데이터 요청, 실험용
  function getFakeData() {
    axios({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/posts",
    }).then((res) => {
      // console.log(res);
      settest(res.data);
    });
  }

  function handleItemClick(itemId) {
    console.log(`Clicked item with ID: ${itemId}`);
    router.push(`/policydetail/${itemId}`);
    // Do whatever you want with the clicked item ID
  }

  useEffect(() => {
    if (calendarDate) {
      setTargetDate(new Date(calendarDate));
    } else setTargetDate(new Date());
  }, []);

  useEffect(() => {
    getFakeData();
  }, []);

  function calendarBtnClick() {
    setIsCalendarActive((prev) => !prev);
  }

  function onClickDay(e) {
    setTargetDate(new Date(e.getFullYear(), e.getMonth(), e.getDate()));
  }

  return (
    <div className={style.wrapper}>
      {/* navbar */}
      <Nav />
      {/* fixed calendar */}
      {isCalendarActive === true ? (
        <PolicyListCalendar onClickDay={onClickDay} targetDate={targetDate} />
      ) : null}

      {/* 바깥쪽 랩 */}
      <div
        className={`${style.list_wrap_container}
          ${isCalendarActive ? style.list_wrap_on : style.list_wrap_off}`}
      >
        {/* 검색창 */}
        <PolicyListSearch />

        {/* 필터 */}
        <PolicyFilter
          isCalendarActive={isCalendarActive}
          calendarBtnClick={calendarBtnClick}
        />

        {/* 정렬 기능 */}
        <PolicyListSort />

        {/* pcylist */}
        <div className={style.pcylist}>
          {testdata ? (
            <PcyListItem obj={testdata} onItemClick={handleItemClick} /> // 그냥 리스트 통째로 프롭함
          ) : (
            <h1>loading...</h1>
          )}
        </div>
      </div>
    </div>
  );
}
