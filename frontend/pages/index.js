import Head from "next/head";
import Layout from "../components/Layout";
import Image from "next/dist/client/image";
import {
  ChevronDownIcon,
  PlusIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import BoardData from "../data/board-data.json";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";

function createGuidId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState(BoardData);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [createTaskVisible, setCreateTaskVisible] = useState(false);

  const handleSave = (task) => {
    // 中身はチェーンにsaveするとかになる？

    // const boardId = e.target.attributes['data-id'].value;
    const boardId = 0
    const item = {
      id: createGuidId(),
      title: task.title,
      description: task.description,
      priority: 0,
      chat: 0,
      attachment: 0,
      assignees: task.assignees ? task.assignees.map((assignee) => {
        return {
          name: assignee.name,
          avt: "/user_01.png"
        }
      }) : [], 
      reviewers: task.reviewers ?? []
    }

    let newBoardData = boardData;
    newBoardData[boardId].items.push(item);
    setBoardData(newBoardData);
    // e.target.value = '';
  }

  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

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

  // const onTextAreaKeyPress = (e) => {
  //   if (e.keyCode === 13) //Enter
  //   {
  //     const val = e.target.value;
  //     const boardId = e.target.attributes['data-id'].value;
  //     const item = {
  //       id: createGuidId(),
  //       title: val,
  //       priority: 0,
  //       chat: 0,
  //       attachment: 0,
  //       assignees: []
  //     }
  //     let newBoardData = boardData;
  //     newBoardData[boardId].items.push(item);
  //     setBoardData(newBoardData);
  //     e.target.value = '';
  //   }
  // }

  const handleModalOpen = () => {
    setCreateTaskVisible(true);
  };

  const handleModalClose = () => {
    setCreateTaskVisible(false);
  };

  const onClickCardItem = () => {
    handleModalOpen()
  }

  return (
    <Layout>
      <div className="p-10 flex flex-col h-screen">
        {/* Board header */}
        <div className="flex flex-initial justify-between">
          <div className="flex items-center">
            <h4 className="text-4xl font-bold text-gray-600">タスク管理</h4>
            <ChevronDownIcon
              className="w-9 h-9 text-gray-500 rounded-full
            p-1 bg-white ml-5 shadow-xl"
            />
          </div>

          <ul className="flex space-x-3">
            <li>
              <Image
                src="/user_01.png"
                width="36"
                height="36"
                objectFit="cover"
                className=" rounded-full "
              />
            </li>
            <li>
              <Image
                src="/user_02.png"
                width="36"
                height="36"
                objectFit="cover"
                className=" rounded-full "
              />
            </li>
            <li>
              <Image
                src="/user_03.png"
                width="36"
                height="36"
                objectFit="cover"
                className=" rounded-full "
              />
            </li>
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
                              <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                            </h4>

                            <div className="overflow-y-auto overflow-x-hidden h-auto"
                              style={{ maxHeight: 'calc(100vh - 290px)' }}>
                              {board.items.length > 0 &&
                                board.items.map((item, iIndex) => {
                                  return (
                                    <CardItem
                                      key={item.id}
                                      data={item}
                                      index={iIndex}
                                      className="m-3"
                                      onClick={onClickCardItem}
                                    />
                                  );
                                })}
                              {provided.placeholder}
                            </div>

                            {
                              // showForm && selectedBoard === bIndex (
                              // <div className="p-3">
                              // <textarea className="border-gray-300 rounded focus:ring-purple-400 w-full"
                              // rows={3} placeholder="Task info"
                              // data-id={bIndex}
                              // onKeyDown={(e) => onTextAreaKeyPress(e)} />
                              // </div>
                              // ) :
                              board.name === "未着手" && (
                                <button
                                  className="flex justify-center items-center my-3 space-x-2 text-lg"
                                  onClick={() => {
                                    setSelectedBoard(bIndex);
                                    // setShowForm(true); 
                                    handleModalOpen();
                                  }}
                                >
                                  <span>タスクを追加</span>
                                  <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                                </button>
                              )
                            }
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
        data={{
          title: "ホームページ制作",
          description: "新規事業を印象付けるためのホームページを制作する。",
          status: "ToDo",
          assignees: ["トヨタ タロウ"],
          reviewers: ["トヨタ ハジメ"]
        }}
        visible={createTaskVisible}
        onOk={handleSave}
        onCancel={handleModalClose}
      />
    </Layout>
  );
}
