import React, {useContext, useEffect} from 'react'
import noteContext from "../context/notes/noteContext"
import DeletedNoteitem from './DeletedNoteitem';
import { useNavigate } from 'react-router-dom';

const DeletedNotes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const {deletedNotes, getDeletedNotes} = context;
    useEffect(() => {
        if(localStorage.getItem('token')){
            getDeletedNotes()
        }
        else{
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [])
    return (
        <div className="container">
            <div className="row my-3">
                <h2>Trash</h2> 
                <div className="container mx-2"> 
                {deletedNotes.length===0 && 'Trash is empty'}
                </div>
                {deletedNotes.map((note)=>{
                    return <DeletedNoteitem key={note._id} showAlert={props.showAlert} note={note}/>  
                })}
            </div>
        </div>
    )
}

export default DeletedNotes
