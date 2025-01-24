import { deleteNote, showNotification, createSharedNote, deleteSharedNote } from "./noteAPIModule.js";

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
const existingSharedNoteModal = document.getElementById('existing-shared-note-modal');



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

// Dùng để copy trong trình duyệt cũ
function copyToClipboardFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('Link copied to clipboard:', text);
    showNotification('Link đã được sao chép vào clipboard!');
  } catch (error) {
    console.error('Failed to copy link:', error);
    showNotification('Không thể sao chép link. Vui lòng thử lại.');
  } finally {
    document.body.removeChild(textarea);
  }
}

// Mở modal chia sẻ
function openShareModal(note) {
  shareNoteTitle.textContent = note.title;
  shareLink.value = window.location.href + `/share/${note.id}`;
  shareModal.style.display = 'flex';
  document.getElementById('copy-link-btn').addEventListener('click', (event) => {
    event.stopPropagation();

    const linkToCopy = shareLink.value;
    if(navigator.clipboard) {
      // Sao chép vào clipboard
      navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        console.log('Link copied to clipboard:', linkToCopy);
        showNotification('Link đã được sao chép vào clipboard!'); // Thông báo cho người dùng
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
        showNotification('Không thể sao chép link. Vui lòng thử lại. Có thể bạn chưa cấp quyền truy cập Clipboard'); // Thông báo lỗi
      });
    } else {
      copyToClipboardFallback(linkToCopy);
    }
    
  });
}

// Mở modal xác nhận xóa
function openDeleteModal(note) {
  deleteNoteTitle.textContent = `Bạn có chắc muốn xóa "${note.title}"?`;
  deleteModal.style.display = 'flex';
  document.getElementById('confirm-delete-btn').addEventListener('click', async (event) => {
    try {
      await deleteNote(note.id);
      deleteModal.style.display = 'none';
    } catch (error) {
      console.error('Lỗi khi xóa ghi chú:', error);
      alert('Có lỗi xảy ra khi xóa ghi chú. Vui lòng thử lại.');
    }
  });
}

function openExistingSharedNoteModal(note) {
  deleteNoteTitle.textContent = `Ghi chú này đang được chia sẻ. Bạn có muốn hủy việc chia sẻ ?`;
  deleteModal.style.display = 'flex';
  document.getElementById('confirm-delete-btn').addEventListener('click', async (event) => {
    try {
      await deleteSharedNote(note.id);
      deleteModal.style.display = 'none';
    } catch (error) {
      console.error('Lỗi khi hủy chia sẻ ghi chú:', error);
      alert('Có lỗi xảy ra khi hủy chia sẻ ghi chú. Vui lòng thử lại.');
    }
  });
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
  window.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown-content');
    const actionButton = document.querySelector('.action-button');

    // Kiểm tra xem người dùng có nhấn ra ngoài dropdown hay không
    if (dropdown.style.display === 'block' && !actionButton.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
  });

  const deleteNoteButtons = document.querySelectorAll('.deleteNoteBtn');
  deleteNoteButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation();

        const dropdown = this.closest('.dropdown-content');
        if (dropdown) {
          dropdown.style.display = 'none';
        }

        const noteElement = this.closest('.note-item');
        const note = NotesByUserID.find(note => note.id === noteElement.dataset.id);
        openDeleteModal(note);
      });
  });

  const shareNoteButtons = document.querySelectorAll('.shareNoteBtn');
  shareNoteButtons.forEach(button => {
    button.addEventListener('click', async function(event) {
      event.stopPropagation();

      const dropdown = this.closest('.dropdown-content');
      if (dropdown) {
        dropdown.style.display = 'none';
      }

      const noteElement = this.closest('.note-item');
      const note = NotesByUserID.find(note => note.id === noteElement.dataset.id);
      const sharedNoteExisting = await createSharedNote(note.id);
      if (sharedNoteExisting == false) {
        openShareModal(note);
      } else {
        openExistingSharedNoteModal(note);
      }
    });
  });
});