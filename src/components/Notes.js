class Notes {
  constructor() {
    this.container = document.querySelector('.notes');
    this.addNoteBtn = document.querySelector('.add-note-btn');
    this.notesList = document.querySelector('.notes-list');
    this.noteIdCounter = 0;

    this.loadNotesFromLocalStorage();
    this.addNoteBtn.addEventListener('click', () => this.addNewNote());
  }

  addNewNote(content = '', id = null) {
    this.hideAllNotes();
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.noteId = id ? id : `note-${this.noteIdCounter++}`;
    note.innerHTML = `
          <div class="note-content" contenteditable="true">${content}</div>
          <button class="save-note">Save</button>
          <button class="delete-note">Delete</button>
        `;
    this.notesList.prepend(note);

    const noteContent = note.querySelector('.note-content');
    noteContent.focus();

    const saveBtn = note.querySelector('.save-note');
    saveBtn.addEventListener('click', () => this.saveNote(note));

    const deleteBtn = note.querySelector('.delete-note');
    deleteBtn.addEventListener('click', () => this.deleteNote(note));

    if (!id) {
      const noteContent = note.querySelector('.note-content');
      noteContent.focus();
    }
  }

  saveNote(note) {
    const noteContent = note.querySelector('.note-content').innerText;
    const title = noteContent.split('\n')[0];
    const date = new Date();

    const dateString = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Verifica se já existe uma pré-visualização para esta nota.
    let notePreview = this.notesList.querySelector(
      `.note-preview[data-note-id="${note.dataset.noteId}"]`
    );

    // Se a pré-visualização não existir, cria uma nova.
    if (!notePreview) {
      notePreview = document.createElement('div');
      notePreview.classList.add('note-preview');
      notePreview.dataset.noteId = note.dataset.noteId;
      this.notesList.appendChild(notePreview);
    }

    // Atualiza o conteúdo da pré-visualização com o título e data atual.
    notePreview.innerHTML = `
      <h3 class="note-title">${title}</h3>
      <p class="note-date">${dateString}</p>
    `;

    notePreview.addEventListener('click', () =>
      this.openNote(note.dataset.noteId)
    );

    // Esconder a nota original após salvar.
    note.style.display = 'none';

    // Mostrar o botão de adicionar uma nova nota novamente.
    this.addNoteBtn.style.display = 'block';

    this.updateLocalStorage();
  }

  openNote(noteId) {
    this.hideAllNotes();
    const note = this.notesList.querySelector(
      `div.note[data-note-id="${noteId}"]`
    );
    if (note) {
      note.style.display = 'block';
      const noteContent = note.querySelector('.note-content');
      noteContent.contentEditable = 'true';
      noteContent.focus();
    }
  }

  deleteNote(note) {
    const notePreview = this.notesList.querySelector(
      `div.note-preview[data-note-id="${note.dataset.noteId}"]`
    );
    if (notePreview) {
      this.notesList.removeChild(notePreview);
    }
    this.notesList.removeChild(note);
    this.addNoteBtn.style.display = 'block';

    this.updateLocalStorage();
  }

  hideAllNotes() {
    const allNotes = this.notesList.querySelectorAll('.note');
    allNotes.forEach((note) => (note.style.display = 'none'));
    this.addNoteBtn.style.display = 'none';
  }

  updateLocalStorage() {
    const notesData = Array.from(this.notesList.querySelectorAll('.note')).map(
      (note) => {
        const content = note.querySelector('.note-content').innerText;
        return {
          id: note.dataset.noteId,
          content: content,
        };
      }
    );

    localStorage.setItem('notes', JSON.stringify(notesData));
  }

  loadNotesFromLocalStorage() {
    const notesData = JSON.parse(localStorage.getItem('notes'));
    if (notesData) {
      notesData.forEach((noteData) => {
        this.noteIdCounter = Math.max(
          this.noteIdCounter,
          parseInt(noteData.id.split('-')[1]) + 1
        );
        this.addNewNote(noteData.content, noteData.id);
      });
    }
  }
}

const notes = new Notes();

export default notes;
