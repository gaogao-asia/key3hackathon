import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { notification } from "antd";
import { DAO_ID } from "../consts/daos";
import { useNotifications } from "../hooks/notifications";
import { useAccount } from "wagmi";

const useDisplayNotifications = (api) => {
  const { address } = useAccount();
  const readyRef = useRef(false);
  const [fromNonce, setFromNonce] = useState(0);
  const notificationsQuery = useNotifications(
    DAO_ID,
    address,
    fromNonce.toString()
  );

  useEffect(() => {
    const initNonceStr = window.localStorage.getItem(
      `notification_nonce_${DAO_ID}`
    );
    const initNonce = initNonceStr !== null ? Number.parseInt(initNonceStr) : 0;

    readyRef.current = true;
    setFromNonce(initNonce);
  }, []);

  console.log("debug::notificationsQuery", notificationsQuery.data);

  useEffect(() => {
    if (!readyRef.current) {
      return;
    }

    const notifications = notificationsQuery?.data?.notifications ?? [];

    if (notifications.length === 0) {
      return;
    }

    const viewNotifications =
      notifications.length > 3
        ? [...notifications.slice(notifications.length - 3)]
        : notifications;

    console.log("debug::viewNotifications", viewNotifications);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      for (const notification of viewNotifications) {
        api.info({
          message: notification.title,
          description: notification.message,
          placement: "bottomRight",
        });

        await sleep(100);
      }
    })();

    const nextNonce =
      Number.parseInt(viewNotifications[viewNotifications.length - 1].nonce) +
      1;
    console.log("debug::nextNonce", nextNonce);

    setTimeout(() => {
      setFromNonce(nextNonce);
      window.localStorage.setItem(
        `notification_nonce_${DAO_ID}`,
        nextNonce.toString()
      );
    }, 5000);
  }, [notificationsQuery?.data, fromNonce]);
};

function Layout({ children }) {
  const router = useRouter();
  const uri = router.pathname
  
  const [api, contextHolder] = notification.useNotification();
  useDisplayNotifications(api);

  return (
    <div 
      className={ // Note: overflow-y-hiddenを無くすとタスクカンバンページの見た目及び挙動が少し変わってしまうため
        `min-w-full min-h-screen h-screen ${uri.includes('profile') ? 'overflow-y-scroll' : 'overflow-y-hidden'} bg-blue-100`
      }>
      {contextHolder}
      <TopBar />
      <SideBar />
      <main className="pl-40 pt-16">{children}</main>
    </div>
  );
}

export default Layout;
