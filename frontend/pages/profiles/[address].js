import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/dist/client/image";
import {
  Card,
  Avatar,
  Progress,
  List,
  Col,
  Row,
  Divider,
  Typography,
  Descriptions,
  Skeleton,
  Tag,
} from "antd";
import Layout from "../../components/Layout";
import { Skills } from "../../consts/skills";
import { Badges } from "../../consts/badges";
import { useAccountSkills } from "../../hooks/account_skills";
import { useAccountProfile } from "../../hooks/account_profile";
import { useTasksByAssigner } from "../../hooks/tasks_by_assigner";
import { AccountColumn } from "../../components/AccountColumn";

const { Text, Title } = Typography;
const { Meta } = Card;

const threshold = 10;

const badgeConditions = [
  {
    // skill name
    name: "営業",
    // badge to be issued
    badgeID: 3,
    // required skill points
    threshold: threshold,
  },
  {
    name: "技術",
    badgeID: 4,
    threshold: threshold,
  },
  {
    name: "チームビルディング",
    badgeID: 5,
    threshold: threshold,
  },
  {
    name: "プロジェクトマネジメント",
    badgeID: 6,
    threshold: threshold,
  },
  {
    name: "プロトタイピング",
    badgeID: 7,
    threshold: threshold,
  },
  {
    name: "プロジェクトマネジメント",
    badgeID: 8,
    threshold: 1,
  },
  {
    name: "マーケティング",
    badgeID: 9,
    threshold: threshold,
  },
  {
    name: "問題解決",
    badgeID: 10,
    threshold: threshold,
  },
  {
    name: "プロジェクトマネジメント",
    badgeID: 11,
    threshold: threshold,
  },
  {
    name: "データ分析",
    badgeID: 12,
    threshold: threshold,
  },
  {
    name: "クリエイティブ思考",
    badgeID: 13,
    threshold: threshold,
  },
  {
    name: "プランニング",
    badgeID: 14,
    threshold: threshold,
  },
  {
    name: "リスクマネジメント",
    badgeID: 15,
    threshold: threshold,
  },
  {
    name: "財務分析",
    badgeID: 16,
    threshold: threshold,
  },
  {
    name: "ユーザビリティテスト",
    badgeID: 17,
    threshold: threshold,
  },
  {
    name: "コミュニケーション",
    badgeID: 18,
    threshold: threshold,
  },
  {
    name: "リーダーシップ",
    badgeID: 19,
    threshold: threshold,
  },
];

const TaskCard = (props) => {
  const { task } = props;
  console.log("debug::task", task);

  const reviewers = (task?.reviewers?.nodes ?? []).map(
    (n) => n.account.address
  );
  const approves = (task?.reviewers?.nodes ?? []).map((n) => n.approved);

  return (
    <Card
      title={
        <Title strong level={5} style={{ textAlign: "center", margin: "0px" }}>
          {task.name}
        </Title>
      }
    >
      <Descriptions column={1} layout="vertical">
        <Descriptions.Item label="プロジェクト">
          {task.dao.name}
        </Descriptions.Item>
        <Descriptions.Item label="レビュワー">
          <div class="grid grid-cols-3 gap-4">
            {reviewers?.map((r, index) => {
              return (
                <AccountColumn
                  key={r}
                  address={r}
                  approved={approves[index] ?? false}
                />
              );
            })}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

const BadgesCard = (props) => {
  const { badges } = props;
  return (
    <Card style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        {badges.map((id) => (
          <Col span={6}>
            <Card
              style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
              }}
            >
              <Image src={Badges[id].icon} width="50" height="50" />
              <div style={{ marginLeft: "8px" }}>{Badges[id].name}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default function Home() {
  const [doneTasks, setDoneTasks] = useState([]);
  const router = useRouter();
  const { address } = router.query;
  const profile = useAccountProfile(address);

  const tasksQuery = useTasksByAssigner(address);
  const skillsQuery = useAccountSkills(address);

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

    const skills = Skills.map((skillData) => {
      const skillPoint = accountSkills.find((s) => s.skill === skillData.name);
      const skillScore = skillPoint ? skillPoint.score : 0;

      return {
        label: skillData.name,
        score: skillScore,
        percent: (100 * skillScore) / upper,
      };
    }).sort((a, b) => b.percent - a.percent);

    const havingSkills = skills.filter((s) => s.score > 0);
    const notHavingSkills = skills.filter((s) => s.score === 0);

    return [...havingSkills, ...notHavingSkills.slice(0, 6)];
  }, [skillsQuery.data]);

  const badgesEarned = useMemo(() => {
    const badges = [];

    badgeConditions.forEach((c) => {
      if (
        skillPoints.find((s) => {
          return s.label === c.name && s.score >= c.threshold;
        })
      ) {
        badges.push(c.badgeID);
      }
    });

    const totalSkillPoints = skillPoints.reduce((a, b) => a + b.score, 0);

    // 伸びしろのある新人
    if (totalSkillPoints > 0) {
      badges.push(0);
    }
    // 一人前のプロフェッショナル
    if (totalSkillPoints > 10) {
      badges.push(1);
    }
    // 一人前のプロフェッショナル
    if (totalSkillPoints > 15) {
      badges.push(2);
    }

    return badges;
  }, [skillsQuery?.data, skillPoints]);

  useMemo(() => {
    setDoneTasks(
      (tasksQuery?.data?.tasks ?? [])
        .slice()
        .filter((t) => {
          return t.status === "done";
        })
        .sort(
          (a, b) =>
            Number.parseInt(b.createdBlockHeight) -
            Number.parseInt(a.createdBlockHeight)
        )
    );
  }, [tasksQuery?.data?.tasks]);

  // hydration errorになる原因わからず、取り急ぎ
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
    <Layout>
      <div
        className="flex flex-col items-center"
        style={{
          overflowY: "scroll",
          zIndex: 0,
        }}
      >
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
              description={profile?.department ?? ""}
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

        <Divider style={{ margin: "0px" }}>
          <Title level={5}>完了したタスク数: {doneTasks.length}</Title>
        </Divider>

        <div className="flex flex-col items-center justify-center w-5/6 m-8">
          <Row gutter={[16, 16]}>
            {doneTasks.map((task) => (
              <Col span={12} key={task.id}>
                <TaskCard task={task} />
              </Col>
            ))}
          </Row>
        </div>

        <Divider style={{ margin: "0px" }}>
          <Title level={5}>獲得した称号: {badgesEarned.length}</Title>
        </Divider>

        <div className="flex flex-col items-center justify-center w-5/6 m-8">
          <BadgesCard badges={badgesEarned} />
        </div>
      </div>
    </Layout>
  );
}
