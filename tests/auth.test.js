import request from 'supertest'; // Dùng để gửi yêu cầu HTTP trong kiểm thử
import app from '../src/app'; // Giả sử bạn đã cấu hình app của mình trong file app.js

describe('Authentication Tests', () => {
    const user = {
        username: 'usertest',
        password: 'passwordtest',
        name: 'Minh Tuan',
        email: 'usertest@gmail.com',
    };

    let authToken;

    // Test đăng ký người dùng
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/user/register') // URL đăng ký của bạn
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Register successfully');
    });

    // Test đăng ký khi người dùng đã tồn tại
    it('should not register a user that already exists', async () => {
        // Đăng ký người dùng lần nữa
        const response = await request(app)
            .post('/user/register')
            .send(user);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
    });

    // Test đăng nhập với thông tin chính xác
    it('should login with correct credentials', async () => {
        const loginData = {
            username: user.username,
            password: user.password,
        };

        const response = await request(app)
            .post('/user/login') // URL đăng nhập của bạn
            .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe('true');
        expect(response.body.message).toBe('Login succesfully');
        expect(response.body).toHaveProperty('redirectURL', '/note');
        expect(response.body).toHaveProperty('user');

        // Lưu token vào biến để dùng cho các kiểm thử sau
        authToken = response.body.token;
    });

    // Test đăng nhập với mật khẩu sai
    it('should fail login with incorrect password', async () => {
        const loginData = {
            username: user.username,
            password: 'WrongPassword',
        };

        const response = await request(app)
            .post('/user/login')
            .send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Incorrect password');
    });

    // Test đăng nhập khi tên người dùng không tồn tại
    it('should fail login with non-existing username', async () => {
        const loginData = {
            username: 'nonExistingUser',
            password: user.password,
        };

        const response = await request(app)
            .post('/user/login')
            .send(loginData);

        expect(response.status).toBe(401);
expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User does not exist');
    });

    // Test kiểm tra cookie token sau khi đăng nhập
    it('should store token in cookies after login', async () => {
        const loginData = {
            username: user.username,
            password: user.password,
        };

        const response = await request(app)
            .post('/user/login')
            .send(loginData);
        
        // Đảm bảo xóa người dùng sau khi kiểm thử
        await request(app).post('/user/delete').send({ username: user.username });

        expect(response.status).toBe(200);
        expect(response.header['set-cookie']).toBeDefined(); // Kiểm tra cookie có được gửi đi không
        expect(response.header['set-cookie'][0]).toContain('token'); // Kiểm tra cookie chứa token
    });
});