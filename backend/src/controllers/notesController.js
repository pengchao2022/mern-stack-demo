import Note from "../models/Note.js";


// health check must be the first 
export async function healthCheck(req, res) {
  res.status(200).send('Server is UP, API is healthy, Welcome to my website, Designed and Developed by Pengchao Ma');
}


// async 是异步函数调用，可以使用 await 关键字
// get
export async function getAllNotes(req, res) {
  try {
    
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send('Server error');
  }
}

// post
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    // console.log(title, content);
    const newNote = new Note({ title, content });
    // save to database
    await newNote.save(); 
    res.status(201).json({message: 'Note created successfully', note: newNote});
  } catch (error) {
    res.status(500).send('Server error');
  }
}

// put
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).send('Note not found');
    }
    res.status(200).json({message: 'Note updated successfully', note: updatedNote});
  } catch (error) {
    res.status(500).send('Server error');
  }
}

// delete
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).send('Note not found');
    }
    res.status(200).json({message: 'Note deleted successfully'});
  } catch (error) {
    res.status(500).send('Server error');
  }
}

// get note by id
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).send('Server error');
  }
}


