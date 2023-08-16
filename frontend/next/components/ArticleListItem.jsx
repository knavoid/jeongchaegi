import React from "react";

export default function ArticleListItem({ obj, onItemClick }) {
  console.log(obj);
  return (
    <>
      {obj.map((item) => (
        <tr
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className="hover:bg-gray-100 cursor-pointer transition duration-200 p-2"
        >
          <td className="w-2/3 px-2 py-4 border-b border-gray-300 text-sm text-gray-600 truncate">
            {item.title ? item.title : "제목 없음"}
          </td>
          <td className="w-1/12 px-2 py-4 border-b border-gray-300 text-sm text-gray-600 truncate">
            {item.memberImg}
            {item.nickname}
          </td>
          <td className="w-3/12 pl-6 py-4 border-b border-gray-300 text-sm text-gray-600 truncate">
            {item.createdAt.slice(0, 10)} {item.createdAt.slice(11)}
          </td>
        </tr>
      ))}
    </>
  );
}
