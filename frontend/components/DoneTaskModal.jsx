// DoneTaskModal (評価、コメント用フォームがある)
// 完了の一番上とかのタスクをクリックすると開く。
import React, { useState } from "react";
import { Modal, Form, Divider, Layout, Spin } from "antd";
import { useDAOContext } from "../contexts/dao_context";
import { useTask } from "../hooks/task";
import { useIPFSData } from "../hooks/ipfs_file";
import { TaskDescription } from "./TaskDescription";
import { SideTaskOverview } from "./SideTaskOverview";

const { Sider, Content } = Layout;

const DoneTaskForm = (props) => {
  const { task, taskMetadata, loading } = props;

  if (loading) {
    return (
      <div
        className="flex flex-col items-center content-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Content>
        <div style={{ paddingRight: "24px" }}>
          <TaskDescription text={taskMetadata?.description} />
          <Divider />
        </div>
      </Content>
      <Sider theme="light">
        <SideTaskOverview task={task} />
      </Sider>
    </Layout>
  );
};

const DoneTaskModal = ({ taskPrimaryID, visible, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState([]);
  const dao = useDAOContext();

  const taskQuery = useTask(taskPrimaryID);
  const { data: taskMetadata, loading: isMetadataLoading } = useIPFSData(
    taskQuery?.data?.task?.metadataURI ?? ""
  );

  const handleOk = () => {
    console.log(form.getFieldsValue);
    onOk(form.getFieldsValue);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={taskQuery?.data?.task?.name}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="1000px"
      bodyStyle={{ margin: "24px 0px" }}
    >
      <DoneTaskForm
        task={taskQuery?.data?.task}
        taskMetadata={taskMetadata}
        loading={taskQuery.loading || isMetadataLoading}
      />
    </Modal>
  );
};

export default DoneTaskModal;
