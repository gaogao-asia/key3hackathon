import Head from "next/head";
import Layout from "../components/Layout";
import Image from "next/dist/client/image";
import { PlusIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Card, Avatar, Progress } from 'antd';

const { Meta } = Card;

export default function Home() {
    return (
        <Layout>
            <Card
                className="flex flex-col items-center justify-center w-1/2 m-8"
            >
                <Meta 
                    className="p-8"
                    avatar={<Avatar
                        style={{ backgroundColor: '#87d068' }}
                        icon={<Image 
                            src={'/user_01.png'}
                            width='300'
                            height='300'
                        />}
                        size={96}
                    />}
                    title="トヨタ タロウ"
                    description="新規事業部リーダー ソフトウェア開発者"
                />
            </Card>
        </Layout>
    );
}
