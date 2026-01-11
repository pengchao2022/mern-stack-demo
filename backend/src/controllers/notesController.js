import Note from "../models/Note.js";

// async 是异步函数调用，可以使用 await 关键字
export async function getAllNotes(req, res) {
  try {
    
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send('Server error');
  }
}

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
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).send('Server error');
  }
}

export function deleteNote(req, res) {
  res.status(200).send(`Note with id ${req.params.id} deleted successfully`);
}

export function healthCheck(req, res) {
  res.status(200).send('the server is up now');
}
