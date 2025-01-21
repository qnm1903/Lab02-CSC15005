// Lấy các phần tử DOM
const noteList = document.getElementById('note-list');
const noteContent = document.getElementById('note-content');
const placeholder = document.getElementById('placeholder');
const shareModal = document.getElementById('share-modal');
const deleteModal = document.getElementById('delete-modal');
const shareNoteTitle = document.getElementById('share-note-title');
const deleteNoteTitle = document.getElementById('delete-note-title');
const shareLink = document.getElementById('share-link');
const closeShare = document.getElementById('close-share');
const closeDelete = document.getElementById('close-delete');
const addNoteBtn = document.getElementById('add-note-btn');

// Dữ liệu ghi chú mẫu
let notes = [
  { id: 1, title: 'Ghi chú 1', content: 'Nội dung ghi chú 1' },
  { id: 2, title: 'Ghi chú 2', content: 'Nội dung ghi chú 2' }
];

// Hiển thị danh sách ghi chú
function displayNoteList() {
  noteList.innerHTML = '';
  notes.forEach(note => {
    const noteItem = document.createElement('li');
    noteItem.className = 'note-item';
    noteItem.innerHTML = `
      <span>${note.title}</span>
      <button class="action-button">...</button>
    `;
    noteItem.addEventListener('click', () => displayNoteContent(note.id));
    noteList.appendChild(noteItem);
  });
}

// Hiển thị nội dung ghi chú
function displayNoteContent(noteId) {
  const note = notes.find(note => note.id === noteId);
  if (note) {
    placeholder.style.display = 'none';
    noteContent.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
  } else {
    placeholder.style.display = 'block';
    noteContent.innerHTML = '';
  }
}

// Mở modal chia sẻ
function openShareModal(note) {
  shareNoteTitle.textContent = note.title;
  shareLink.value = `https://example.com/note/${note.id}`;
  shareModal.style.display = 'flex';
}

// Mở modal xác nhận xóa
function openDeleteModal(note) {
  deleteNoteTitle.textContent = `Bạn có chắc muốn xóa "${note.title}"?`;
  deleteModal.style.display = 'flex';
  document.getElementById('confirm-delete-btn').onclick = () => {
    notes = notes.filter(n => n.id !== note.id);
    displayNoteList();
    deleteModal.style.display = 'none';
  };
}

// Đóng modal
closeShare.addEventListener('click', () => (shareModal.style.display = 'none'));
closeDelete.addEventListener('click', () => (deleteModal.style.display = 'none'));

// Thêm sự kiện cho nút thêm ghi chú
addNoteBtn.addEventListener('click', () => {
  const newNote = {
    id: Date.now(),
    title: `Ghi chú mới`,
    content: `Nội dung ghi chú mới`
  };
  notes.push(newNote);
  displayNoteList();
  displayNoteContent(newNote.id);
});

// Hiển thị danh sách ghi chú khi tải trang
displayNoteList();