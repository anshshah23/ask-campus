// import { useState } from 'react';
// import Modal from 'react-modal'; // Install this library using npm/yarn
// import toast from 'react-hot-toast'; // For notifications

// const StatusModal = ({ isOpen, onClose, onUpdate, query }) => {
//     const [status, setStatus] = useState(query.status);
//     const [completedText, setCompletedText] = useState('');

//     const handleStatusChange = (newStatus) => {
//         setStatus(newStatus);
//     };

//     const handleComplete = () => {
//         if (completedText.trim() === '') {
//             toast.error('Please enter completion details.');
//             return;
//         }
//         onUpdate(status, completedText);
//     };

//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             contentLabel="Update Status"
//             className="modal-content"
//             overlayClassName="modal-overlay"
//         >
//             <h2 className="text-xl font-bold">Update Query Status</h2>
//             <div className="mt-4">
//                 <button
//                     onClick={() => handleStatusChange('inProgress')}
//                     className={`btn ${status === 'inProgress' ? 'bg-blue-500' : ''}`}
//                 >
//                     In Progress
//                 </button>
//                 <button
//                     onClick={() => handleStatusChange('completed')}
//                     className={`btn ml-2 ${status === 'completed' ? 'bg-green-500' : ''}`}
//                 >
//                     Complete
//                 </button>
//             </div>
//             {status === 'completed' && (
//                 <textarea
//                     value={completedText}
//                     onChange={(e) => setCompletedText(e.target.value)}
//                     placeholder="Enter completion details"
//                     className="w-full mt-4 p-2 border"
//                 />
//             )}
//             <div className="flex justify-end mt-4">
//                 <button onClick={onClose} className="btn mr-2">Cancel</button>
//                 <button onClick={handleComplete} className="btn bg-green-500">Submit</button>
//             </div>
//         </Modal>
//     );
// };
