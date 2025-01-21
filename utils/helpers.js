/**
 * Tạo UUID ngẫu nhiên (theo chuẩn RFC 4122, version 4)
 * @returns {string} UUID
 */
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * Kiểm tra chuỗi có rỗng hoặc chỉ chứa khoảng trắng
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} true nếu chuỗi rỗng hoặc chỉ chứa khoảng trắng
 */
export function isEmptyOrWhitespace(str) {
  return !str || str.trim().length === 0;
}

/**
 * Định dạng ngày giờ thành chuỗi dễ đọc
 * @param {string|Date} dateInput - Ngày giờ dạng chuỗi hoặc đối tượng Date
 * @returns {string} Ngày giờ được định dạng
 */
export function formatDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return 'Ngày giờ không hợp lệ';
  }
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Lưu dữ liệu vào Local Storage
 * @param {string} key - Khóa để lưu trữ
 * @param {any} value - Giá trị cần lưu (sẽ được chuyển thành JSON)
 */
export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Lỗi khi lưu vào Local Storage:', error);
  }
}

/**
 * Lấy dữ liệu từ Local Storage
 * @param {string} key - Khóa lưu trữ
 * @returns {any|null} Giá trị được lấy ra (sẽ được chuyển từ JSON), hoặc null nếu không có
 */
export function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Local Storage:', error);
    return null;
  }
}

/**
 * Xóa dữ liệu khỏi Local Storage
 * @param {string} key - Khóa cần xóa
 */
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu khỏi Local Storage:', error);
  }
}

/**
 * Tạo đoạn mã HTML an toàn từ chuỗi văn bản
 * @param {string} str - Chuỗi văn bản cần chuyển đổi
 * @returns {string} Chuỗi HTML an toàn
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

/**
 * Giới hạn độ dài của chuỗi văn bản
 * @param {string} str - Chuỗi cần giới hạn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Chuỗi đã được giới hạn
 */
export function truncateText(str, maxLength) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Tạo một khoảng thời gian chờ (delay)
 * @param {number} milliseconds - Thời gian chờ (ms)
 * @returns {Promise} Promise hoàn thành sau khoảng thời gian chờ
 */
export function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
