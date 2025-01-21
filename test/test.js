// Lấy container kiểm thử
const testContainer = document.getElementById('test-container');

// Kiểm thử danh sách ghi chú
function testNoteListRendering() {
  const ul = document.createElement('ul');
  mockNotes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.title;
    ul.appendChild(li);
  });
  testContainer.appendChild(ul);
}

// Kiểm thử modal
function testModalRendering() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Modal kiểm thử</h3>
      <p>Nội dung của modal</p>
    </div>
  `;
  testContainer.appendChild(modal);
}

// Gọi các hàm kiểm thử
testNoteListRendering();
testModalRendering();
