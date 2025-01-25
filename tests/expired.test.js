import request from "supertest";
import app from "../src/app.js"; // Đường dẫn đến ứng dụng của bạn
import { db } from "../src/configs/pgp.config.js"; // Kết nối PostgreSQL của bạn
import { jest } from '@jest/globals';

jest.mock("../src/configs/pgp.config.js"); // Mock module kết nối database

describe("Access control for shared notes with UUID", () => {
  beforeAll(() => {
    // Mock hành vi của `db.shared_note`
    db.shared_note = {
      findOne: jest.fn(),
    };
  });

  test("should allow access to a valid UUID note", async () => {
    // Mock tìm thấy bản ghi với `note_id`
    db.shared_note.findOne.mockResolvedValue({
      note_id: "123e4567-e89b-12d3-a456-426614174000",
    });

    const res = await request(app).get(
      "/note/share/123e4567-e89b-12d3-a456-426614174000"
    );
    expect(res.statusCode).toBe(200);
  });

  test("should return 404 for a non-existing UUID note", async () => {
    // Mock không tìm thấy bản ghi
    db.shared_note.findOne.mockResolvedValue(null);

    const res = await request(app).get(
      "/note/share/123e4567-e89b-12d3-a456-426614174001"
    );
    expect(res.statusCode).toBe(404);
  });

  test("should return 404 for an invalid UUID format", async () => {
    const res = await request(app).get("/note/share/invalid-uuid");
    expect(res.statusCode).toBe(404);
  });
});