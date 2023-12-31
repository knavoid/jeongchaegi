import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useStompClient = (connectUrl, subscribe) => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: connectUrl, // STOMP 클라이언트가 연결할 웹소켓 서버의 URL을 지정
      connectHeaders: {
        // STOMP 연결을 초기화할 때 전송될 헤더를 지정
        login: "guest",
        passcode: "guest",
      },
      // debug: function (str) {
      //   // 디버그 메시지를 출력
      //   console.error(str);
      // },
      reconnectDelay: 5000, // 연결이 끊긴 경우 재연결을 시도하기 전에 대기할 시간
      webSocketFactory: () => new SockJS(connectUrl),
    });

    // STOMP 웹소켓 서버에 성공적으로 연결되었을 때 실행되는 콜백 함수
    stompClient.onConnect = (frame) => {
      stompClient.subscribe(subscribe, (message) => {
        setMessages((prevMessages) => [...prevMessages, message.body]);
      });
    };

    stompClient.activate(); // stompClient를 활성화하고 웹소켓 연결을 시작

    setClient(stompClient);

    return () => {
      stompClient.deactivate(); // 웹소켓 연결을 종료
    };
  }, [connectUrl, subscribe]);

  return { client, messages, setMessages };
};

export default useStompClient;
