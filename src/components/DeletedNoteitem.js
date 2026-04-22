import React, {useContext} from 'react'
import noteContext from "../context/notes/noteContext"

const DeletedNoteitem = (props) => {
    const context = useContext(noteContext);
    const { restoreNote, hardDeleteNote } = context;
    const { note } = props;
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fas fa-trash-restore mx-2" style={{cursor: "pointer", color: "green"}} onClick={()=>{restoreNote(note._id); if(props.showAlert) props.showAlert("Note Restored", "success")}}></i>
                        <i className="fas fa-minus-circle mx-2 text-danger" style={{cursor: "pointer"}} onClick={()=>{hardDeleteNote(note._id); if(props.showAlert) props.showAlert("Note Deleted Permanently", "success")}}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default DeletedNoteitem
