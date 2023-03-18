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
import { Descriptions, Popover, notification } from "antd";
import { DAOContextProvider } from "../contexts/dao_context";
import { useTasks } from "../hooks/tasks";
import { TASK_STATUSES } from "../consts/enums";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();

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

  console.log("queryTasks", queryTasks);

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
        assigner: assigner
          ? {
              avt: assigner.icon,
              address: task.assigner,
            }
          : null,
        reviewers: task.reviewers.nodes.map((n) => n.account.address),
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

  const onCreatedTask = (task) => {
    const assigner = AccountsMap[task.assigner];

    const item = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.id,
      chat: 0,
      attachment: 0,
      assigner: assigner
        ? {
            avt: assigner.icon,
            address: task.assigner,
          }
        : null,
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

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
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

  const onClickInProgressTaskCardItem = (item) => {
    setSelectedTaskPrimaryID(item.primaryID);
    setInProgressTaskVisible(true);
  };

  const onClickTaskReviewerCardItem = (item) => {
    setSelectedTaskPrimaryID(item.primaryID);
    setTaskReviewerVisible(true);
  };

  const onClickDoneTaskCardItem = (item) => {
    setSelectedTaskPrimaryID(item.primaryID);
    setDoneTaskVisible(true);
  };

  // 現在表示されているタスクを移動させる
  const moveTask = (taskPrimaryID, from, to) => {
    setBoardData((prevBoredData) => {
      const target = prevBoredData[from].items.find(
        (item) => item.primaryID === taskPrimaryID
      );

      return prevBoredData.map((boardData, index) => {
        if (index !== from && index !== to) {
          // keep
          return boardData;
        }

        if (index === from) {
          // remove target card
          return {
            ...boardData,
            items: boardData.items.filter(
              (item) => item.primaryID !== taskPrimaryID
            ),
          };
        }

        // add target card
        return {
          ...boardData,
          items: [
            ...boardData.items,
            ...(target
              ? [
                  {
                    ...target,
                    status: TASK_STATUSES[to],
                  },
                ]
              : []),
          ].sort((a, b) => a.id - b.id),
        };
      });
    });
  };

  // タスク作成モーダルが閉じられた
  const onCloseCreateModal = () => {
    setCreateTaskVisible(false);
  };

  //  タスクが開始された
  const onTaskStarted = (taskPrimaryID) => {
    moveTask(taskPrimaryID, 0, 1);

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
  };

  const onReviewRequested = (taskPrimaryID) => {
    moveTask(taskPrimaryID, 1, 2);

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
  };

  const onChangeRequested = (taskPrimaryID) => {
    moveTask(taskPrimaryID, 2, 1);

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
  };

  // タスクが完了した
  const onTaskCompleted = (taskPrimaryID) => {
    moveTask(taskPrimaryID, 2, 3);

    (async () => {
      // SubQueryの反映に時間がかかるので、ちょい待機
      await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

      queryTasks.refetch();
    })();
  };

  // タスク開始モーダルが閉じられた
  const onCancelAssigned = (taskPrimaryID, isSuccess) => {
    setAssignedToDoTaskVisible(false);

    if (!isSuccess) {
      moveTask(taskPrimaryID, 1, 0);
    }
  };

  // 作業中タスクモーダルが閉じられた
  const onCancelInProgress = (taskPrimaryID, isSuccess) => {
    setInProgressTaskVisible(false);

    if (!isSuccess) {
      moveTask(taskPrimaryID, 2, 1);
    }
  };

  // タスクレビューモーダルが閉じられた
  const onCancelTaskReviewer = (taskPrimaryID, isSuccess) => {
    setTaskReviewerVisible(false);

    if (!isSuccess) {
      moveTask(taskPrimaryID, 1, 2);
    }
  };

  // 完了タスクのモーダルが閉じられた
  const onCancelDoneTask = () => {
    setDoneTaskVisible(false);
  };

  // よくわからんデフォルトのコード
  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  const [api, contextHolder] = notification.useNotification();

  const onDragEnd = (re) => {
    if (!re.destination) return;

    const fromBoard = Number.parseInt(re.source.droppableId);
    const toBoard = Number.parseInt(re.destination.droppableId);

    if (fromBoard === toBoard) {
      // safe check
      return;
    }

    const targetTask = (queryTasks?.data?.tasks ?? []).find((t) => {
      return t.taskID === re.draggableId;
    });

    if (targetTask === undefined) {
      return;
    }

    const showError = (message) => {
      api.error({
        message: "エラー",
        description: message,
        placement: "bottomRight",
      });
    };

    const showWarning = (message) => {
      api.warning({
        message: "エラー",
        description: message,
        placement: "bottomRight",
      });
    };

    // 誰がどのボードからカードを動かせるかはCardItemにわたすisDragDisabledで既に制御している
    switch (fromBoard) {
      case 0:
        switch (toBoard) {
          case 1:
            setSelectedTaskPrimaryID(targetTask.id);
            setAssignedToDoTaskVisible(true);

            moveTask(targetTask.id, 0, 1);
            return;
          case 2:
            showError("レビュー依頼をする前に、タスクを開始する必要があります");
            return;
          case 3:
            showError("タスクを完了するにはレビュワーの承認が必要です");
            return;
        }
      case 1:
        switch (toBoard) {
          case 0:
            showWarning("すでにタスクを開始しています");
            return;
          case 2:
            setSelectedTaskPrimaryID(targetTask.primaryID);
            setInProgressTaskVisible(true);

            moveTask(targetTask.id, 1, 2);
            return;
          case 3:
            showError("タスクを完了するにはレビュワーの承認が必要です");
            return;
        }
      case 2:
        switch (toBoard) {
          case 0:
            showWarning("すでにタスクを開始しています");
            return;
          case 1:
            setSelectedTaskPrimaryID(targetTask.primaryID);
            setTaskReviewerVisible(true);

            moveTask(targetTask.id, 2, 1);
            return;
          case 3:
            showError("タスクを完了するにはすべてのレビュワーの承認が必要です");
            return;
        }
    }
  };

  return (
    <Layout>
      <DAOContextProvider value={queryDAO.data}>
        {contextHolder}
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
                                        isDragDisabled={(() => {
                                          switch (bIndex) {
                                            case 0:
                                              return (
                                                address !==
                                                item?.assigner?.address
                                              );
                                            case 1:
                                              return (
                                                address !==
                                                item?.assigner?.address
                                              );
                                            case 2:
                                              return (
                                                item.reviewers.indexOf(
                                                  address
                                                ) === -1
                                              );
                                            case 3:
                                              // 完了したタスクはドラッグできない
                                              return true;
                                          }

                                          return true;
                                        })()}
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
          onClose={onCloseCreateModal}
        />
        <AssignedToDoTaskModal
          taskPrimaryID={selectedTaskPrimaryID}
          visible={assignedToDoTaskVisible}
          onTaskStarted={onTaskStarted}
          onCancel={onCancelAssigned}
        />
        <InProgressTaskModal
          taskPrimaryID={selectedTaskPrimaryID}
          visible={inProgressTaskVisible}
          onReviewRequested={onReviewRequested} // ToDo: レビュー依頼機能
          onCancel={onCancelInProgress}
        />
        <TaskReviewerModal
          taskPrimaryID={selectedTaskPrimaryID}
          visible={TaskReviewerVisible}
          onChangeRequested={onChangeRequested}
          onCompleted={onTaskCompleted}
          onCancel={onCancelTaskReviewer}
        />
        <DoneTaskModal
          taskPrimaryID={selectedTaskPrimaryID}
          visible={DoneTaskVisible}
          onOk={onCancelDoneTask}
          onCancel={onCancelDoneTask}
        />
      </DAOContextProvider>
    </Layout>
  );
}
