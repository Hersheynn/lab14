// src/tests/validators.test.ts — กิจกรรมที่ 6 (Unit Test ด้วย Jest)
import {
    countCompletedTasks,
    filterTasks,
    formatDate,
    isEmailValid,
    isPasswordStrong,
    isTaskCompleted,
    isTextNotEmpty,
    validateTaskForm,
} from "../utils/validators";

// 1-2. อีเมล
test("ตรวจสอบอีเมลที่ถูกต้อง", () => {
  expect(isEmailValid("student@example.com")).toBe(true);
});
test("ตรวจสอบอีเมลที่ไม่ถูกต้อง (ไม่มี @)", () => {
  expect(isEmailValid("student")).toBe(false);
});
test("ตรวจสอบอีเมลที่ไม่ถูกต้อง (ไม่มี .)", () => {
  expect(isEmailValid("student@examplecom")).toBe(false);
});

// 3-4. รหัสผ่าน
test("ตรวจสอบรหัสผ่านที่แข็งแรง", () => {
  expect(isPasswordStrong("abc12345")).toBe(true);
});
test("ตรวจสอบรหัสผ่านสั้นเกินไป", () => {
  expect(isPasswordStrong("123")).toBe(false);
});

// 5-6. ข้อความว่าง
test("ตรวจสอบข้อความไม่ว่าง", () => {
  expect(isTextNotEmpty("React Native")).toBe(true);
});
test("ตรวจสอบข้อความว่าง", () => {
  expect(isTextNotEmpty("   ")).toBe(false);
});

// 7-8. จำนวนรายการ
test("นับงานเสร็จแล้วมากกว่า 0", () => {
  const tasks = [
    { id: "1", title: "A", completed: true },
    { id: "2", title: "B", completed: false },
    { id: "3", title: "C", completed: true },
  ];
  expect(countCompletedTasks(tasks)).toBe(2);
});
test("รายการว่างต้องได้ 0", () => {
  expect(countCompletedTasks([])).toBe(0);
});

// 9-10. ข้อมูลครบถ้วน
test("ข้อมูลฟอร์มครบถ้วน", () => {
  expect(validateTaskForm({ title: "ทำการบ้าน" }).isValid).toBe(true);
});
test("ข้อมูลฟอร์มไม่ครบถ้วน", () => {
  const result = validateTaskForm({ title: "" });
  expect(result.isValid).toBe(false);
  expect(result.message).toBe("กรุณากรอกชื่องาน");
});

// เพิ่มเติม: สถานะงาน / วันที่ / กรองรายการ
test("isTaskCompleted ตรวจสอบสถานะงาน", () => {
  expect(isTaskCompleted({ id: "1", title: "A", completed: true })).toBe(true);
  expect(isTaskCompleted({ id: "2", title: "B", completed: false })).toBe(
    false,
  );
});
test("formatDate แปลงวันที่เป็น พ.ศ.", () => {
  expect(formatDate("2026-09-28T10:00:00Z")).toContain("2569");
});
test("filterTasks กรองตามคำค้น", () => {
  const tasks = [
    { id: "1", title: "ซื้อของ", completed: false },
    { id: "2", title: "อ่านหนังสือ", completed: true },
  ];
  const result = filterTasks(tasks, "ซื้อ", "all");
  expect(result).toHaveLength(1);
  expect(result[0].title).toBe("ซื้อของ");
});
