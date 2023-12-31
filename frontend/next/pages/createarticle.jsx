import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import Nav from "../components/Nav";
import OurAxios from "../config/ourAxios";
import { useRouter } from "next/router";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function CreateArticle() {
  const [mytitle, setTitle] = useState("")
  const [value, setValue] = useState("")
  const api = OurAxios()
  const router = useRouter()

  // 함수 목록
  function mySubmit(e) {
    e.preventDefault();
    if (!mytitle) {
      alert('제목을 입력하세요!')
      return
    }
    else if(!value){
      alert('내용을 입력하세요!')
      return
    }
    api.post("/posts", {
      title: mytitle,
      content: value,
    }).then((res) => {
    }).catch((err) => {
      alert('제출할 수 없습니다!')
    })
    .finally(()=>{
      router.push('/articlelist')
    })
  }

  function handleTitle(e) {
    const curTitle = e.target.value
    setTitle(curTitle)
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto mt-24">
        <form onSubmit={mySubmit} className="max-w-3xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold mb-2">Title</h1>
            <input 
              type="text" 
              onChange={handleTitle} 
              value={mytitle} 
              className="w-full border rounded p-2"
              placeholder="Enter article title here..."
            />
          </div>
          <div className="mb-4" data-color-mode="dark">
            <MDEditor
              value={value}
              onChange={setValue}
              visibleDragbar={false}
              height={400}
            />
          </div>
          <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
