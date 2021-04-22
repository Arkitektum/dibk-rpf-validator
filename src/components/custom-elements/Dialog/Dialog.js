import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux'
import { hideDialog } from 'store/slices/dialogSlice';


const Dialog = () => {
   const show = useSelector(state => state.dialog.show);
   const title = useSelector(state => state.dialog.title);
   const message = useSelector(state => state.dialog.message);
   const dispatch = useDispatch();

   const onHide = () => {
      dispatch(hideDialog());
   }
   
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