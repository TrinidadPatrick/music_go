import React from 'react'
import Modal from 'react-modal';



const ModalComponent = ({open, setOpen, children}) => {
    
    const modalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '99999999',
          padding: '0',
          backgroundColor: 'transparent',
          border: 'none',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
    };

    Modal.setAppElement('#root');
  return (
    <Modal isOpen={open} style={modalStyle} onRequestClose={() => setOpen(false)}>
        {children}
    </Modal>
  )
}

export default ModalComponent