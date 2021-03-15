import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Dialog = ({ show, onHide, title, message }) => {
   return (
      <Modal show={show} onHide={onHide} animation={false} centered>
         <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
         </Modal.Header>
         <Modal.Body>{message}</Modal.Body>
         <Modal.Footer>
            <Button variant="primary" onClick={onHide}>Lukk</Button>
         </Modal.Footer>
      </Modal>
   );
};

export default Dialog