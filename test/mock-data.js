/**
 * Mock dữ liệu ghi chú cho ứng dụng
 */
export const mockNotes = [
  {
    id: '1',
    title: 'Ghi chú 1',
    content: 'Nội dung ghi chú số 1: Lưu ý đầu tiên cần nhớ.',
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-01-21T08:00:00Z',
  },
  {
    id: '2',
    title: 'Ghi chú 2',
    content: 'Nội dung ghi chú số 2: Thông tin quan trọng cần lưu trữ.',
    createdAt: '2025-01-20T13:00:00Z',
    updatedAt: '2025-01-21T09:00:00Z',
  },
  {
    id: '3',
    title: 'Ghi chú 3',
    content: 'Nội dung ghi chú số 3: Công việc cần hoàn thành.',
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z',
  },
];

/**
 * Hàm tạo ghi chú mới
 * @param {string} title - Tiêu đề ghi chú
 * @param {string} content - Nội dung ghi chú
 * @returns {object} Ghi chú mới
 */
export function createMockNote(title, content) {
  const newNote = {
    id: generateMockID(),
    title: title || 'Tiêu đề không xác định',
    content: content || 'Nội dung không xác định',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockNotes.push(newNote);
  return newNote;
}

/**
 * Hàm xóa ghi chú theo ID
 * @param {string} id - ID của ghi chú cần xóa
 * @returns {boolean} Kết quả xóa (true nếu thành công, false nếu thất bại)
 */
export function deleteMockNote(id) {
  const noteIndex = mockNotes.findIndex((note) => note.id === id);
  if (noteIndex > -1) {
    mockNotes.splice(noteIndex, 1);
    return true;
  }
  return false;
}

/**
 * Hàm cập nhật ghi chú theo ID
 * @param {string} id - ID của ghi chú cần cập nhật
 * @param {string} newTitle - Tiêu đề mới
 * @param {string} newContent - Nội dung mới
 * @returns {object|null} Ghi chú sau khi cập nhật hoặc null nếu không tìm thấy
 */
export function updateMockNote(id, newTitle, newContent) {
  const note = mockNotes.find((note) => note.id === id);
  if (note) {
    note.title = newTitle || note.title;
    note.content = newContent || note.content;
    note.updatedAt = new Date().toISOString();
    return note;
  }
  return null;
}

/**
 * Hàm tạo ID giả lập
 * @returns {string} ID ngẫu nhiên
 */
function generateMockID() {
  return Math.random().toString(36).substr(2, 9); // Tạo ID ngẫu nhiên
}

/**
 * Hàm lấy danh sách ghi chú
 * @returns {array} Danh sách ghi chú
 */
export function getMockNotes() {
  return mockNotes;
}
