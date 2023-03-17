import Head from "next/head";
import Layout from "../components/Layout";
import Image from "next/dist/client/image";
import { PlusIcon, PlusCircleIcon } from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import AssignedToDoTaskModal from "../components/AssignedToDoTaskModal";
import InProgressTaskModal from "../components/InProgressTaskModal";
import { useDAO } from "../hooks/dao";
import { DAO_ID } from "../consts/daos";
import TaskReviewerModal from "../components/TaskReviewerModal";
import DoneTaskModal from "../components/DoneTaskModal";
import { Skills } from "../consts/skills";
import { Accounts, AccountsMap } from "../consts/accounts";
import { Descriptions, Popover } from "antd";
import { DAOContextProvider } from "../contexts/dao_context";
import { useTasks } from "../hooks/tasks";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [createTaskVisible, setCreateTaskVisible] = useState(false);

  // 選択されたタスクのIDが入るイメージ
  const [selectedTaskPrimaryID, setSelectedTaskPrimaryID] = useState(null);
  // AssignedToDoTaskModal用のstate
  const [assignedToDoTaskVisible, setAssignedToDoTaskVisible] = useState(false);
  // InProgressTaskModal用のstate
  const [inProgressTaskVisible, setInProgressTaskVisible] = useState(false);
  // TaskReviewerModal用のstate
  const [TaskReviewerVisible, setTaskReviewerVisible] = useState(false);
  // DoneTaskModal用のstate
  const [DoneTaskVisible, setDoneTaskVisible] = useState(false);

  const queryDAO = useDAO(DAO_ID);
  const queryTasks = useTasks(DAO_ID);

  useEffect(() => {
    const todoItems = [];
    const inProgressItems = [];
    const inReviewItems = [];
    const doneItems = [];

    (queryTasks?.data?.tasks ?? []).forEach((task) => {
      const iTaskID = Number.parseInt(task.taskID);
      const assigner = AccountsMap[task.assigner];

      const item = {
        // SubQueryのPrimary Key
        primaryID: task.id,
        id: iTaskID,
        priority: iTaskID,
        title: task.name,
        chat: 1, // TODO: fix
        attachment: 2, // TODO: fix
        assignees: assigner
          ? [
              {
                avt: assigner.icon,
              },
            ]
          : [],
        status: task.status,
      };

      switch (task.status) {
        case "todo":
          todoItems.push(item);
          break;
        case "in_progress":
          inProgressItems.push(item);
          break;
        case "in_review":
          inReviewItems.push(item);
          break;
        case "done":
          doneItems.push(item);
          break;
      }
    });

    setBoardData([
      {
        name: "未着手",
        items: todoItems,
      },
      {
        name: "作業中",
        items: inProgressItems,
      },
      {
        name: "レビュー中",
        items: inReviewItems,
      },
      {
        name: "完了",
        items: doneItems,
      },
    ]);
  }, [queryTasks.data?.tasks]);

  console.log("queryTasks", queryTasks);
  console.log("boardData", boardData);

  const onCreatedTask = (task) => {
    const assigner = AccountsMap[task.assigner];

    const item = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.id,
      chat: 0,
      attachment: 0,
      assignees: assigner
        ? [
            {
              avt: assigner.icon,
            },
          ]
        : [],
    };

    setBoardData((prevBoardData) => {
      return [
        {
          name: prevBoardData[0].name,
          items: [...prevBoardData[0].items, item],
        },
        ...prevBoardData.slice(1),
      ];
    });
  };

  // ToDo: タスク開始機能の実装

  // ToDo: レビュー依頼機能の実装

  // ToDo: タスク承認機能の実装
  // ToDo: 修正依頼機能の実装

  // ToDo: タスク評価送信機能の実装 (If possible)

  // 無視してください
  const onClickCardItem = () => {
    console.log("clicked");
  };

  const onClickCreateTaskCardItem = () => {
    setCreateTaskVisible(true);
  };

  const onClickAssignedToDoTaskCardItem = (item) => {
    setSelectedTaskPrimaryID(item.primaryID);
    setAssignedToDoTaskVisible(true);
  };

  const onClickInProgressTaskCardItem = () => {
    setInProgressTaskVisible(true);
  };

  const onClickTaskReviewerCardItem = () => {
    setTaskReviewerVisible(true);
  };

  const onClickDoneTaskCardItem = () => {
    setDoneTaskVisible(true);
  };

  const onCancelCreate = (isCreatedTask) => {
    setCreateTaskVisible(false);

    if (isCreatedTask) {
      (async () => {
        // SubQueryの反映に時間がかかるので、ちょい待機
        await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

        queryTasks.refetch();
      })();
    }
  };

  const onTaskStarted = (taskPrimaryID) => {
    setBoardData((prevBoredData) => {
      const target = prevBoredData[0].items.find(
        (item) => item.primaryID === taskPrimaryID
      );

      return [
        {
          name: prevBoredData[0].name,
          items: prevBoredData[0].items.filter(
            (item) => item.primaryID !== taskPrimaryID
          ),
        },
        {
          name: prevBoredData[1].name,
          items: target
            ? [
                ...prevBoredData[1].items,
                {
                  ...target,
                  status: "in_progress",
                },
              ]
            : prevBoredData[1].items,
        },
        ...prevBoredData.slice(2),
      ];
    });

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
  };

  const onCancelAssigned = () => {
    setAssignedToDoTaskVisible(false);
  };

  const onCancelInProgress = () => {
    setInProgressTaskVisible(false);
  };

  const onCancelTaskReviewer = () => {
    setTaskReviewerVisible(false);
  };

  const onCancelDoneTask = () => {
    setDoneTaskVisible(false);
  };

  // よくわからんデフォルトのコード
  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  // Drag & Dropあんま関係なし
  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].items[re.source.index];
    newBoardData[parseInt(re.source.droppableId)].items.splice(
      re.source.index,
      1
    );
    newBoardData[parseInt(re.destination.droppableId)].items.splice(
      re.destination.index,
      0,
      dragItem
    );
    setBoardData(newBoardData);
  };

  return (
    <Layout>
      <DAOContextProvider value={queryDAO.data}>
        <div className="p-10 flex flex-col h-screen">
          {/* Board header */}
          <div className="flex flex-initial justify-between">
            <div className="flex items-center">
              <h4 className="text-4xl font-bold text-gray-600">
                {queryDAO?.dao?.name}
              </h4>
            </div>

            <ul className="flex space-x-3">
              {(queryDAO?.members ?? []).map((member) => {
                const profile = Accounts.find((a) => a.address === member);
                if (!profile) {
                  return null;
                }

                return (
                  <li>
                    <Popover
                      trigger="hover"
                      content={
                        <div style={{ width: "400px" }}>
                          <Descriptions title={profile.fullname} column={1}>
                            <Descriptions.Item label="Address">
                              {profile.address}
                            </Descriptions.Item>
                          </Descriptions>
                        </div>
                      }
                    >
                      <Image
                        src={profile.icon}
                        width="36"
                        height="36"
                        objectFit="cover"
                        className=" rounded-full "
                      />
                    </Popover>
                  </li>
                );
              })}
              <li>
                <button
                  className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center
                rounded-full"
                >
                  <PlusIcon className="w-5 h-5 text-gray-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Board columns */}
          {ready && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-4 gap-5 my-5">
                {boardData.map((board, bIndex) => {
                  return (
                    <div key={board.name}>
                      <Droppable droppableId={bIndex.toString()}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <div
                              className={`bg-gray-100 rounded-md shadow-md
                            flex flex-col relative overflow-hidden 
                            ${board.name !== "未着手" && "pb-5"}
                            ${snapshot.isDraggingOver && "bg-green-100"}`}
                            >
                              <span
                                className="w-full h-1 bg-gradient-to-r from-pink-700 to-red-200
                          absolute inset-x-0 top-0"
                              ></span>
                              <h4 className=" p-3 flex justify-between items-center mb-2">
                                <span className="text-2xl text-gray-600">
                                  {board.name}
                                </span>
                              </h4>

                              <div
                                className="overflow-y-auto overflow-x-hidden h-auto"
                                style={{ maxHeight: "calc(100vh - 290px)" }}
                              >
                                {board.items.length > 0 &&
                                  board.items.map((item, iIndex) => {
                                    return (
                                      <CardItem
                                        key={item.id}
                                        data={item}
                                        index={iIndex}
                                        className="m-3"
                                        onClick={
                                          board.name === "未着手"
                                            ? () =>
                                                onClickAssignedToDoTaskCardItem(
                                                  item
                                                )
                                            : board.name === "作業中"
                                            ? () =>
                                                onClickInProgressTaskCardItem(
                                                  item
                                                )
                                            : board.name === "レビュー中"
                                            ? () =>
                                                onClickTaskReviewerCardItem(
                                                  item
                                                )
                                            : board.name === "完了"
                                            ? () =>
                                                onClickDoneTaskCardItem(item)
                                            : () => onClickCardItem(item)
                                        }
                                      />
                                    );
                                  })}
                                {provided.placeholder}
                              </div>

                              {board.name === "未着手" && (
                                <button
                                  className="flex justify-center items-center my-3 space-x-2 text-lg"
                                  onClick={() => {
                                    setSelectedBoard(bIndex);
                                    onClickCreateTaskCardItem();
                                  }}
                                >
                                  <span>タスクを追加</span>
                                  <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}
        </div>
        <CreateTaskModal
          visible={createTaskVisible}
          onCreated={onCreatedTask}
          onCancel={onCancelCreate}
        />
        <AssignedToDoTaskModal
          data={{
            title: "ホームページ制作",
            description: "新規事業を印象付けるためのホームページを制作する。",
            status: "ToDo",
            assignees: ["user1"],
            reviewers: ["user2"],
            skills: ["マーケティング#ff80ed", "技術#ff0000"],
          }}
          taskPrimaryID={selectedTaskPrimaryID}
          visible={assignedToDoTaskVisible}
          onTaskStarted={onTaskStarted}
          onCancel={onCancelAssigned}
        />
        <InProgressTaskModal
          data={{
            title: "戦略リサーチ",
            description: "新規事業を成功させるための戦略を調査する。",
            status: "In Progress",
            assignees: ["user3"],
            reviewers: ["user2"],
            skills: ["プランニング#065535", "問題解決#ffd700"],
          }}
          visible={inProgressTaskVisible}
          onOk={onCancelInProgress} // ToDo: レビュー依頼機能
          onCancel={onCancelInProgress}
        />
        <TaskReviewerModal
          data={{
            title: "ダッシュボード作成",
            description: "データを活用した新規事業の検証、改善に役立てる。",
            status: "In Review",
            assignees: ["user1"],
            reviewers: ["user2"],
            skills: [
              Skills[9].name + Skills[9].color,
              Skills[4].name + Skills[4].color,
            ],
          }}
          visible={TaskReviewerVisible}
          onOk={onCancelTaskReviewer} // ToDo: 承認機能, 修正依頼機能
          onCancel={onCancelTaskReviewer}
        />
        <DoneTaskModal
          data={{
            title: "予定表作成",
            description: "新規事業の計画をチームメンバーにわかりやすく伝える。",
            status: "Done",
            assignees: ["user1"],
            reviewers: ["user2"],
            skills: [
              Skills[1].name + Skills[1].color,
              Skills[15].name + Skills[15].color,
            ],
          }}
          visible={DoneTaskVisible}
          onOk={onCancelDoneTask} // ToDo: タスク評価機能
          onCancel={onCancelDoneTask}
        />
      </DAOContextProvider>
    </Layout>
  );
}
