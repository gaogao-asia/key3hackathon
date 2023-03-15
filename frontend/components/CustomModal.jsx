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
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}
        >
            <h2>{data.title}</h2>
            <p>新規事業を印象付けるためのホームページを制作する。</p>
        </Modal>
    );
}

export default CustomModal