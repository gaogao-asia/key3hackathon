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
              bodyStyle={{ padding: "8px" }}
            >
              {Badges[id].name}
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
  console.log("debug::profile", profile);

  const tasksQuery = useTasksByAssigner(address);
  const skillsQuery = useAccountSkills(address);

  const badgesEarned = [3, 5, 8, 12]; // ToDo: 一旦、ハードコードしている

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

    return [...havingSkills, ...notHavingSkills.slice(0, 10)];
  }, [skillsQuery.data]);

  useMemo(() => {
    setDoneTasks(
      (tasksQuery?.data?.tasks ?? [])
        .slice()
        .filter((t) => {
          console.log("debug::t", t);
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
