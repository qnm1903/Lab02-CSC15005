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
const NotesByUserID = JSON.parse(document.getElementById('notes-data').textContent);



// Hiển thị danh sách ghi chú
function displayNoteList() {
  noteList.innerHTML = '';
  NotesByUserID.forEach(note => {
    const noteItem = document.createElement('li');
    noteItem.className = 'note-item';
    noteItem.dataset.id = note.id;
    noteItem.dataset.content = note.content;
    noteItem.innerHTML = `
      <span>${note.title}</span>
      <button class="action-button">...</button>
      <div class="dropdown-content">
        <button class="deleteNoteBtn">Xóa ghi chú</button>
        <button class="shareNoteBtn">Chia sẻ ghi chú</button>
      </div>
    `;
    noteItem.addEventListener('click', () => displayNoteContent(note.id));
    noteList.appendChild(noteItem);
  });
}

// Hiển thị nội dung ghi chú
function displayNoteContent(noteId) {
  const note = NotesByUserID.find(note => note.id === noteId);
  if (note) {
    placeholder.style.display = 'none';
    const pdfBlob = new Blob([new Uint8Array(note.content.data)], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);
    noteContent.innerHTML = `<h3>${note.title}</h3>
    <embed src="${pdfURL}" type="application/pdf" width="100%" height="500px">`;
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
    NotesByUserID = NotesByUserID.filter(n => n.id !== note.id);
    displayNoteList();
    deleteModal.style.display = 'none';
  };
}

// Đóng modal
closeShare.addEventListener('click', () => (shareModal.style.display = 'none'));
closeDelete.addEventListener('click', () => (deleteModal.style.display = 'none'));

// Hiển thị danh sách ghi chú khi tải trang
displayNoteList();

document.addEventListener('DOMContentLoaded', function() {
  let currentOpenDropdown = null;

  const actionButtons = document.querySelectorAll('.action-button');
  actionButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        const dropdownContent = this.nextElementSibling;

        // Đóng dropdown đang mở (nếu có)
        if (currentOpenDropdown && currentOpenDropdown !== dropdownContent) {
          currentOpenDropdown.style.display = 'none';
        }

        // Mở dropdown hiện tại
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        // Cập nhật dropdown đang mở
        currentOpenDropdown = dropdownContent.style.display === 'block' ? dropdownContent : null;
      });
  });
  // Đóng dropdown khi nhấn ra ngoài
  window.addEventListener('click', function() {
    if (currentOpenDropdown) {
        currentOpenDropdown.style.display = 'none';
        currentOpenDropdown = null;
    }
  });

  // const deleteNoteButtons = document.querySelectorAll('.deleteNoteBtn');
  // deleteNoteButtons.forEach(button => {
  //     button.addEventListener('click', function() {
  //         const noteElement = this.closest('.note');
  //         const noteTitle = noteElement.querySelector('span').innerText;
  //         if (confirm(`Bạn có chắc chắn muốn xóa ghi chú "${noteTitle}" không?`)) {
  //             // Gọi API xóa ghi chú
  //             deleteNote(noteTitle);
  //         }
  //     });
  // });

  // const shareNoteButtons = document.querySelectorAll('.shareNoteBtn');
  // shareNoteButtons.forEach(button => {
  //     button.addEventListener('click', function() {
  //         const noteElement = this.closest('.note');
  //         const noteTitle = noteElement.querySelector('span').innerText;
  //         // Gọi API chia sẻ ghi chú
  //         shareNote(noteTitle);
  //     });
  // });
});