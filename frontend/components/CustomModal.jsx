import React from "react";
import Modal from 'react-modal';

const customStyles = {
    // content: {
    //     top: '50%',
    //     left: '50%',
    //     right: 'auto',
    //     bottom: 'auto',
    //     marginRight: '-50%',
    //     transform: 'translate(-50%, -50%)',
    // },
};

function CustomModal({ data, modalIsOpen, handleModalClose }) {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleModalClose}
            className="inset-0 flex items-center justify-center w-full"
            overlayClassName="fixed inset-0 bg-gray-900 opacity-95 flex items-center justify-center"
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}
        >
            <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-w-lg w-full">
                <div className="p-4">
                    <label htmlFor="title" className="block font-bold mb-2">
                        タイトル:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={data.title}
                        className="border rounded px-3 py-2 w-full mb-2"
                    // onChange={handleInputChange}
                    />

                    <label htmlFor="description" className="block font-bold mb-2">
                        概要:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        className="border rounded px-3 py-2 w-full mb-2"
                    // onChange={handleInputChange}
                    />

                    <label htmlFor="status" className="block font-bold mb-2">
                        ステータス:
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={data.status}
                        className="border rounded px-3 py-2 w-full mb-2"
                    // onChange={handleInputChange}
                    >
                        <option value="ToDo">ToDo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Done">Done</option>
                    </select>

                    <label htmlFor="assignee" className="block font-bold mb-2">
                        担当者:
                    </label>
                    <input
                        type="text"
                        id="assignee"
                        name="assignee"
                        value={data.assignee}
                        className="border rounded px-3 py-2 w-full mb-2"
                    // onChange={handleInputChange}
                    />

                    <button 
                        onClick={handleModalClose}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >閉じる</button>
                </div>
            </div>
        </Modal>
    );
}

export default CustomModal;