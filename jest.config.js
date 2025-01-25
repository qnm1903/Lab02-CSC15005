export default {
    transform: {}, // Bỏ qua transforming để hỗ trợ ESM
    testEnvironment: 'node', // Môi trường chạy test là Node.js
    testMatch: ['**/tests/**/*.test.js'], // Chỉ chạy các file test trong thư mục test
};