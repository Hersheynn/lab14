// utils/validators.ts — กิจกรรมที่ 5
// Pure Functions ที่แยกออกจาก Component เพื่อให้ Unit Test ได้ง่าย

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// 1. ตรวจสอบอีเมล
export const isEmailValid = (email: string): boolean =>
  email.includes("@") && email.includes(".") && email.indexOf("@") > 0;

// 2. ตรวจสอบรหัสผ่าน (ยาว ≥ 8 และมีตัวเลขอย่างน้อย 1 ตัว)
export const isPasswordStrong = (password: string): boolean =>
  password.length >= 8 && /\d/.test(password);

// 3. ตรวจสอบค่าว่าง
export const isTextNotEmpty = (text: string): boolean => text.trim().length > 0;

// 4. นับจำนวนรายการงานที่เสร็จแล้ว
export const countCompletedTasks = (tasks: Task[]): number =>
  tasks.filter((t) => t.completed).length;

// 5. ตรวจสอบข้อมูลก่อนบันทึก
export const validateTaskForm = (task: {
  title: string;
}): { isValid: boolean; message: string } => {
  if (!isTextNotEmpty(task.title))
    return { isValid: false, message: "กรุณากรอกชื่องาน" };
  return { isValid: true, message: "" };
};

// 6. ตรวจสอบสถานะงาน
export const isTaskCompleted = (task: Task): boolean => task.completed;

// 7. แปลงข้อมูลวันที่เป็นรูปแบบไทย dd/mm/yyyy
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
};

// 8. กรองรายการตามคำค้นและสถานะ
export const filterTasks = (
  tasks: Task[],
  keyword: string,
  status: "all" | "completed" | "pending",
): Task[] =>
  tasks.filter((t) => {
    const matchKw = t.title
      .toLowerCase()
      .includes(keyword.trim().toLowerCase());
    const matchStatus =
      status === "all"
        ? true
        : status === "completed"
          ? t.completed
          : !t.completed;
    return matchKw && matchStatus;
  });
