import axios from 'https://cdn.skypack.dev/axios';
import api from '/utils/api.js';

// Lấy các phần tử DOM
const inputFile = document.getElementById('input-file');
const addNoteBtn = document.getElementById('add-note-btn');
const logoutBtn = document.getElementById('logout-button');

// Khi người dùng nhấn vào button
addNoteBtn.addEventListener('click', (event) => {
    event.preventDefault();
    inputFile.click(); // Mở hộp thoại chọn file
});

logoutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    //Xoá thông tin user
    localStorage.removeItem('user');

    //Gọi api logout
    api.post('/user/logout').then(response => {
        if (response.success) {
            // Redirect nếu logout thành công
            window.location.href = response.redirectURL;
        }
    }).catch(error => {
        // Xử lý lỗi nếu có
        console.error('Logout failed', error);
        alert('Logout failed. Please try again.');
    });
}) 

// Khi người dùng chọn file
inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Lấy file được chọn

    if (file) {
        const formData = new FormData();
        formData.append('pdfFile', file); // Thêm file vào FormData

        // Gửi file bằng Axios
        axios.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Đặt header cho form-data
        },
        })
        .then(response => {
            console.log('Upload successful:', response.data);
            alert('File uploaded successfully!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        });
    }
});

export const deleteNote = async (noteId) => {
    try {
        const response = await axios.delete(`/api/delete-note/${noteId}`);
        if (response.data.result.success) {
            alert(response.data.result.message);
            window.location.reload();
        } else {
            alert(response.data.result.message);
        }
    } catch (error) {
        console.error('Lỗi khi xóa ghi chú:', error);
        alert('Có lỗi xảy ra trong quá trình xóa ghi chú');
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const createSharedNote = async (noteId) => {
    try {
        const response = await axios.post(`/api/create-shared-note/${noteId}`);
        if (response.data.existing === false) {
            if (response.data.result.success) {
                showNotification(response.data.message);
            } else {
                showNotification(response.data.message);
            }
        }
        return response.data.existing;
    } catch (error) {
        console.error('Lỗi khi tạo chia sẻ ghi chú:', error);
        showNotification('Có lỗi xảy ra trong quá trình chia sẻ ghi chú');
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}

export const showNotification = (message, duration = 2000) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '1';
    notification.style.transition = 'opacity 0.5s';
    document.body.appendChild(notification);
  
    // Tự động tắt thông báo sau khoảng thời gian duration
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          notification.remove();
        }, 500);
    }, duration);
}

export const deleteSharedNote = async (noteId) => {
    try {
        const response = await axios.delete(`/api/delete-shared-note/${noteId}`);
        if (response.data.result.success) {
            showNotification(response.data.message);
        } else {
            showNotification(response.data.result.message);
        }
    } catch (error) {
        console.error('Lỗi khi xóa chia sẻ ghi chú:', error);
        alert('Có lỗi xảy ra trong quá trình xóa chia sẻ ghi chú');
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};