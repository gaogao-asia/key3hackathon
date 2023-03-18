import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/dist/client/image";
import { Card, Avatar, Progress, List } from "antd";
import Layout from "../../components/Layout";
import { Skills } from "../../consts/skills";
import { useAccountSkills } from "../../hooks/account_skills";
import { useAccountProfile } from "../../hooks/account_profile";

const { Meta } = Card;

export default function Home() {
  const router = useRouter();
  const { address } = router.query;
  const skillsQuery = useAccountSkills(address);
  const profile = useAccountProfile(address);

  const skillPoints = useMemo(() => {
    const accountSkills = skillsQuery?.data?.skills ?? [];
    const maxScoreSkill = accountSkills.reduce(
      (maxSkill, skill) => {
        return maxSkill.score > skill.score ? maxSkill : skill;
      },
      { score: -1 }
    );

    // 100%の値を取得スキル値の最大ポイント * 1.5
    // TODO: これ直して、全社員の最大値から求める？
    const upper = maxScoreSkill.score * 2.0;

    return Skills.map((skillData) => {
      const skillPoint = accountSkills.find((s) => s.skill === skillData.name);
      const skillScore = skillPoint ? skillPoint.score : 0;

      return {
        label: skillData.name,
        score: skillScore,
        percent: (100 * skillScore) / upper,
      };
    }).sort((a, b) => b.percent - a.percent);
  }, [skillsQuery.data]);

  // hydration errorになる原因わからず、取り急ぎ
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
    <Layout>
      <div className="flex justify-center">
        <Card
          className="flex flex-col items-center justify-center w-5/6 m-8"
          title={
            <Meta
              className="p-8"
              avatar={
                profile && (
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={
                      <Image src={profile?.icon} width="300" height="300" />
                    }
                    size={96}
                  />
                )
              }
              title={profile?.fullname ?? ""}
              description="新規事業部リーダー ソフトウェア開発者"
            />
          }
          bodyStyle={{ width: "100%", overflowY: "auto" }}
        >
          <div className="w-full">
            {firstRender === false && (
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={skillPoints}
                renderItem={(item) => (
                  <List.Item>
                    <p>{item.label}</p>
                    <Progress
                      label={item.label}
                      percent={item.percent}
                      strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                      format={() => item.score}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
