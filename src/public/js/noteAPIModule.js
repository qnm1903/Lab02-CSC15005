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