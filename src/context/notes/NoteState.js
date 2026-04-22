import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = process.env.REACT_APP_API_URL;

  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);

  // Helper: get token safely
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Get all Notes
  const getNotes = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log("No token found");
        setNotes([]);
        return;
      }

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("Error fetching notes:", json);
        setNotes([]);
        return;
      }

      setNotes(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("getNotes error:", error);
      setNotes([]);
    }
  };

  // Get all Deleted Notes
  const getDeletedNotes = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/fetchtrash`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("Error fetching deleted notes:", json);
        setDeletedNotes([]);
        return;
      }

      setDeletedNotes(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("getDeletedNotes error:", error);
      setDeletedNotes([]);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const note = await response.json();

      if (!response.ok) {
        console.log("Error adding note:", note);
        return;
      }

      setNotes((prev) => [...prev, note]);
    } catch (error) {
      console.error("addNote error:", error);
    }
  };

  // Soft Delete a Note
  const deleteNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) return;

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("deleteNote error:", error);
    }
  };

  // Restore a Note
  const restoreNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/restorenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) return;

      setDeletedNotes((prev) =>
        prev.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("restoreNote error:", error);
    }
  };

  // Hard Delete a Note
  const hardDeleteNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/harddelete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) return;

      setDeletedNotes((prev) =>
        prev.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("hardDeleteNote error:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) return;

      setNotes((prev) =>
        prev.map((note) =>
          note._id === id
            ? { ...note, title, description, tag }
            : note
        )
      );
    } catch (error) {
      console.error("editNote error:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        deletedNotes,
        addNote,
        deleteNote,
        editNote,
        getNotes,
        getDeletedNotes,
        restoreNote,
        hardDeleteNote,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;