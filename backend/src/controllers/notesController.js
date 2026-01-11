export function getAllNotes(req, res) {
  res.status(200).send('Retrieve all notes');
}

export function createNote(req, res) {
  res.status(201).send('Note created successfully');
}

export function updateNote(req, res) {
  res.status(200).send(`Note with id ${req.params.id} updated successfully`);
}

export function deleteNote(req, res) {
  res.status(200).send(`Note with id ${req.params.id} deleted successfully`);
}

export function healthCheck(req, res) {
  res.status(200).send('the server is up now');
}
