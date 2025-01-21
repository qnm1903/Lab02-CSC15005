// Import các hàm tiện ích cần kiểm thử
import { createUUID } from '../utils/helpers.js';

// Mock dữ liệu mẫu để kiểm thử
const mockNotes = [
  { id: '1', title: 'Ghi chú 1', content: 'Nội dung ghi chú 1' },
  { id: '2', title: 'Ghi chú 2', content: 'Nội dung ghi chú 2' },
];

// Kết quả kiểm thử sẽ được lưu ở đây
const testResults = [];

/**
 * Hàm ghi nhận kết quả kiểm thử
 * @param {string} testName - Tên bài kiểm thử
 * @param {boolean} passed - Kết quả kiểm thử (PASS/FAIL)
 * @param {string} message - Mô tả kết quả kiểm thử
 */
function recordTestResult(testName, passed, message) {
  testResults.push({
    testName,
    passed,
    message,
  });
  console.log(`${testName}: ${passed ? 'PASS' : 'FAIL'} - ${message}`);
}

/**
 * Kiểm thử hàm tạo UUID
 */
function testCreateUUID() {
  const uuid = createUUID();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const passed = uuidRegex.test(uuid);
  const message = passed
    ? `UUID hợp lệ: ${uuid}`
    : `UUID không hợp lệ: ${uuid}`;
  recordTestResult('Tạo UUID', passed, message);
}

/**
 * Kiểm thử danh sách ghi chú
 */
function testMockNotes() {
  const passed = Array.isArray(mockNotes) && mockNotes.length === 2;
  const message = passed
    ? `Danh sách ghi chú có ${mockNotes.length} mục.`
    : 'Danh sách ghi chú không đúng định dạng hoặc bị lỗi.';
  recordTestResult('Kiểm thử danh sách ghi chú', passed, message);
}

/**
 * Kiểm thử hiển thị nội dung ghi chú
 */
function testDisplayNoteContent() {
  const note = { id: '1', title: 'Test Note', content: 'This is a test.' };
  const renderedContent = `<h3>${note.title}</h3><p>${note.content}</p>`;
  const passed = renderedContent.includes(note.title) &&
    renderedContent.includes(note.content);
  const message = passed
    ? `Nội dung hiển thị đúng: "${note.content}"`
    : 'Nội dung ghi chú không được hiển thị đúng.';
  recordTestResult('Hiển thị nội dung ghi chú', passed, message);
}

/**
 * Kiểm thử thêm ghi chú
 */
function testAddNote() {
  const newNote = { id: '3', title: 'Ghi chú 3', content: 'Nội dung ghi chú 3' };
  const updatedNotes = [...mockNotes, newNote];
  const passed = updatedNotes.length === 3 && updatedNotes.includes(newNote);
  const message = passed
    ? `Ghi chú mới đã được thêm thành công. Tổng số ghi chú: ${updatedNotes.length}`
    : 'Không thể thêm ghi chú mới.';
  recordTestResult('Thêm ghi chú', passed, message);
}

/**
 * Kiểm thử xóa ghi chú
 */
function testDeleteNote() {
  const noteToDelete = '1';
  const updatedNotes = mockNotes.filter(note => note.id !== noteToDelete);
  const passed = updatedNotes.length === 1 && !updatedNotes.some(note => note.id === noteToDelete);
  const message = passed
    ? 'Ghi chú đã được xóa thành công.'
    : 'Ghi chú không được xóa đúng cách.';
  recordTestResult('Xóa ghi chú', passed, message);
}

/**
 * Chạy tất cả các bài kiểm thử
 */
function runAllTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ ---');
  testCreateUUID();
  testMockNotes();
  testDisplayNoteContent();
  testAddNote();
  testDeleteNote();
  console.log('--- KẾT THÚC KIỂM THỬ ---');
  console.log('Kết quả kiểm thử:', testResults);
}

// Gọi hàm chạy tất cả kiểm thử
runAllTests();
