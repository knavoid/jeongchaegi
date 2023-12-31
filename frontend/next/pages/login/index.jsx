import React from "react";
import styles from "../../styles/Login.module.css";
import Image from "next/image";
import Nav from "../../components/Nav";
import Link from "next/link";

function KakaoLoginOrSignup() {
  return (
    <div className={styles.all_wrapper}>
      <Nav />
      <div className={styles.content_container}>
        <div className={styles.head_wrapper}>
          <Link href="/">
            <a>
              <Image
                src="/Logo_white.png"
                width="200px"
                height="80px"
                alt="정채기 로고"
              />
            </a>
          </Link>
        </div>
        <div className={styles.content_wrapper}>
          <div className={styles.text_wrapper}>
            카카오 로그인으로 모든 기능 이용하기
          </div>
          <div className={styles.kakao_wrapper}>
            <a href="http://www.jeongchaegi.com:8081/oauth2/authorization/kakao">
              <Image
                src="/kakao_login_large_wide.png"
                width="420px"
                height="63px"
                alt="카카오 로그인"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <>
      <KakaoLoginOrSignup />
    </>
  );
}
