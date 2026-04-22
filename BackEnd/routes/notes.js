const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

// Route 1 : Get all the active Notes using: GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id, deleted: false });
    res.json(notes);
  } catch(error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});

// Route 2 : Add a new Notes using: POST "/api/notes/addnote". Login Required
router.post("/addnote",fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),],async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 : Update an existing Note using: PUT "/api/notes/updatenote/:id". Login Required
router.put("/updatenote/:id",fetchuser,async (req, res) => {
    const {title, description, tag} = req.body;
    try {
        const newNote = {} 
        if(title) {newNote.title = title };
        if(description) {newNote.description = description };
        if(tag) {newNote.tag = tag };
    
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send({error: "Not Allowed"})
        }
    
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

// Route 4 : Soft Delete a Note using: DELETE "/api/notes/deletenote/:id". Login Required
router.delete("/deletenote/:id",fetchuser ,async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
    
        note = await Note.findByIdAndUpdate(req.params.id, {$set: {deleted: true}}, {new: true})
        res.json({"Success": "Note has been moved to Trash", note: note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

// Route 5 : Fetch Trashed Notes using: GET "/api/notes/fetchtrash". Login Required
router.get("/fetchtrash", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id, deleted: true });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 6 : Restore Note using: PUT "/api/notes/restorenote/:id". Login Required
router.put("/restorenote/:id",fetchuser ,async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
    
        note = await Note.findByIdAndUpdate(req.params.id, {$set: {deleted: false}}, {new: true})
        res.json({"Success": "Note has been restored", note: note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

// Route 7 : Hard Delete a Note using: DELETE "/api/notes/harddelete/:id". Login Required
router.delete("/harddelete/:id",fetchuser ,async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
    
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been permanently deleted", note: note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

module.exports = router;