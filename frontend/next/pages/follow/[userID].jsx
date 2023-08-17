import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Image from "next/image";
import FollowPage from "../../components/FollowPage";
import OurAxios from "../../config/ourAxios";

export default function Follow() {
  const api = OurAxios();
  const [search, setSearch] = useState(""); // 검색어
  const [followNum, setFollowNum] = useState(0); // 팔로우 수
  const [followList, setFollowList] = useState([]); // 팔로우 리스트
  const [showList, setShowList] = useState(followList); // 출력용 리스트
  const [showModal, setShowModal] = useState(null); // 모달

  // ①팔로워 수 ②팔로워 리스트 받아오기
  useEffect(() => {
    const myData = localStorage.getItem("persist:root");

    if (myData) {
      const parsedValue = JSON.parse(myData);
      const userObject = JSON.parse(parsedValue.user);
      const myId = userObject.id;

      api
        .get("/members/followInfo", { params: { memberId: myId } })
        .then((responseObject) => {
          setFollowNum(responseObject.data.followee);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .get("/members/followeeList")
        .then((responseList) => {
          setFollowList(responseList.data);
          console.log("팔로우리스트 1번째 요소 : " + responseList.data[0]);
          console.log(
            "팔로우리스트 1번째 요소 타입 : " + typeof responseList.data[0]
          );
          const list = followList.slice();
          setShowList(list);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("persist:root 값을 찾을 수 없습니다.");
    }
  }, []);

  const handleUnFollow = (id) => {
    api
      .delete(`/members/${id}/unFollow`)
      .then((res) => {
        const afterList = followList.filter((user) => user.id !== id);
        setFollowList(afterList);
        setShowList(afterList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchName = async () => {
    api
      .get("/members/followeeList", {
        params: {
          nickname: search,
        },
      })
      .then((responseSearch) => {
        setShowList(responseSearch.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("showList : " + showList);
  console.log("showList의 타입 : " + typeof showList);
  console.log("showList의 2번째 요소 : " + showList[1]);
  console.log("showList의 2번째 요소 타입 : " + typeof showList[1]);

  return (
    <>
      <Nav />
      <div className="bg-gray-100 min-h-screen mt-24 px-80 py-4">
        <div className="flex justify-between items-cetnter mb-6">
          <h1 className="text-2xl font-bold text-gray-800">팔로우 리스트</h1>
          <span>{followNum}</span>
          <div className="flex justify-end ml-auto w-3/4">
            <input
              className="border rounded w-2/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="닉네임 검색 ex) 심뿐이"
              value={search}
              onChange={handleSearch}
            />
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={searchName}
            >
              입력
            </button>
          </div>
        </div>
        {showList.map((user, index) => {
          return (
            <div
              className="relative flex items-center bg-white p-4 mb-4 rounded-md shadow-sm"
              key={user.id}
            >
              <Image
                src={user.img}
                alt={user.nickname}
                width={48}
                height={48}
                className="rounded-full mr-6"
                onMouseEnter={() => setShowModal(index)} // index를 사용하여 어떤 이미지에 대한 모달인지 구분
                // onMouseLeave={() => setShowModal(null)}
              />
              <div className="flex-grow pl-6">
                <div className="font-semibold text-gray-700">
                  {user.nickname}
                </div>
                <div className="text-sm text-gray-500">{user.id}</div>
              </div>
              <button
                onClick={() => handleUnFollow(user.id)}
                className="text-black font-bold bg-gray-200 py-1 px-4 rounded-md hover:bg-gray-300"
              >
                팔로잉
              </button>

              {/* Modal */}
              {showModal === index && (
                <div className="absolute top-10 left-20 mt-4 bg-white rounded-md shadow-lg z-10">
                  <FollowPage user={user} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
