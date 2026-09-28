// App.tsx — Lab บทที่ 14 (Expo SDK 57)
// รวม Demo ทุกกิจกรรมไว้ในไฟล์เดียว กดปุ่มเมนูเพื่อดูแต่ละกิจกรรม
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";

// ==============================================
// ฟังก์ชัน Helper ทั้งหมด (รวมไว้ในไฟล์เดียว)
// ==============================================
const isEmailValid = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isPasswordStrong = (pass: string) => {
  return pass.length >= 8 && /\d/.test(pass);
};

const isTextNotEmpty = (text: string) => {
  return text.trim().length > 0;
};

const validateTaskForm = ({ title }: { title: string }) => {
  if (!isTextNotEmpty(title)) {
    return { isValid: false, message: "กรุณากรอกชื่องาน" };
  }
  return { isValid: true, message: "" };
};

const countCompletedTasks = (tasks: { completed: boolean }[]) => {
  return tasks.filter((t) => t.completed).length;
};

const isTaskCompleted = (task: { completed: boolean }) => {
  return task.completed;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const filterTasks = (
  tasks: { id: string; title: string; completed: boolean }[],
  keyword: string,
  status?: string,
) => {
  return tasks.filter((t) => {
    const matchesKeyword = t.title
      .toLowerCase()
      .includes(keyword.toLowerCase());
    return matchesKeyword;
  });
};

// ==============================================
// กิจกรรมที่ 5/6: Demo validators
// ==============================================
function ValidatorsDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [message, setMessage] = useState<{
    type: "err" | "ok";
    text: string;
  } | null>(null);

  const emailOk = email === "" ? null : isEmailValid(email);
  const passOk = password === "" ? null : isPasswordStrong(password);
  const taskOk = taskTitle === "" ? null : isTextNotEmpty(taskTitle);

  const handleSave = () => {
    setMessage(null);

    if (email.trim() === "") {
      setMessage({ type: "err", text: "กรุณากรอกอีเมล" });
      return;
    }
    if (password.trim() === "") {
      setMessage({ type: "err", text: "กรุณากรอกรหัสผ่าน" });
      return;
    }
    if (taskTitle.trim() === "") {
      setMessage({ type: "err", text: "กรุณากรอกชื่องาน" });
      return;
    }

    if (emailOk !== true) {
      setMessage({ type: "err", text: "รูปแบบอีเมลไม่ถูกต้อง" });
      return;
    }
    if (passOk !== true) {
      setMessage({
        type: "err",
        text: "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษรและมีตัวเลข",
      });
      return;
    }

    const check = validateTaskForm({ title: taskTitle });
    if (!check.isValid) {
      setMessage({ type: "err", text: check.message });
      return;
    }

    setMessage({
      type: "ok",
      text: "สำเร็จ: ผ่านการตรวจสอบทั้งหมดเรียบร้อยแล้ว",
    });
  };

  return (
    <ScrollView contentContainerStyle={s.pad}>
      <Text style={s.h}>กิจกรรม 5-6: Validators + Unit Test</Text>

      <Text style={s.label}>อีเมล</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        placeholder="student@example.com"
        autoCapitalize="none"
      />
      {emailOk === false && <Text style={s.err}>✗ รูปแบบอีเมลไม่ถูกต้อง</Text>}
      {emailOk === true && <Text style={s.ok}>✓ อีเมลถูกต้อง</Text>}

      <Text style={s.label}>รหัสผ่าน (อย่างน้อย 8 ตัว + ตัวเลข)</Text>
      <TextInput
        style={s.input}
        value={password}
        onChangeText={setPassword}
        placeholder="abc12345"
        secureTextEntry
      />
      {passOk === false && <Text style={s.err}>✗ รหัสผ่านไม่ผ่านเกณฑ์</Text>}
      {passOk === true && <Text style={s.ok}>✓ รหัสผ่านแข็งแรง</Text>}

      <Text style={s.label}>ชื่องาน</Text>
      <TextInput
        style={s.input}
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholder="ซื้อของเข้าบ้าน"
      />
      {taskOk === false && <Text style={s.err}>✗ กรุณากรอกชื่องาน</Text>}
      {taskOk === true && <Text style={s.ok}>✓ ชื่องานถูกต้อง</Text>}

      {message && (
        <Text style={message.type === "err" ? s.errBox : s.successBox}>
          {message.text}
        </Text>
      )}

      <PrimaryButton title="บันทึกข้อมูล" onPress={handleSave} />
    </ScrollView>
  );
}

// ==============================================
// กิจกรรมที่ 7: Component Testing Demo
// ==============================================
function TaskCard({
  title,
  completed,
  onToggle,
}: {
  title: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={s.card} onPress={onToggle} testID="task-card">
      <Text style={[s.cardText, completed && s.done]}>{title}</Text>
      <Text style={s.badge}>{completed ? "✓ เสร็จแล้ว" : "รอดำเนินการ"}</Text>
    </Pressable>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return <Text style={s.errBox}>{message}</Text>;
}

function ComponentDemo() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "ซื้อของเข้าบ้าน", completed: false },
    { id: "2", title: "อ่านหนังสือ บทที่ 14", completed: true },
  ]);
  const done = countCompletedTasks(tasks);

  return (
    <ScrollView contentContainerStyle={s.pad}>
      <Text style={s.h}>กิจกรรม 7: Component Test Demo</Text>
      <Text style={s.sub}>
        Component: PrimaryButton, TaskCard, ErrorMessage
      </Text>
      <ErrorMessage message="" />
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          title={t.title}
          completed={t.completed}
          onToggle={() =>
            setTasks(
              tasks.map((x) =>
                x.id === t.id ? { ...x, completed: !x.completed } : x,
              ),
            )
          }
        />
      ))}
      <Text style={s.sub}>
        จำนวนงานที่เสร็จ: {done} / {tasks.length}
      </Text>
      <Text style={s.sub}>
        isTaskCompleted(tasks[1]) = {String(isTaskCompleted(tasks[1]))}
      </Text>
      <Text style={s.sub}>
        formatDate = {formatDate("2026-09-28T10:00:00Z")}
      </Text>
      <PrimaryButton
        title="เพิ่มงาน"
        onPress={() =>
          setTasks([
            ...tasks,
            { id: Date.now().toString(), title: "งานใหม่", completed: false },
          ])
        }
      />
    </ScrollView>
  );
}

// ==============================================
// กิจกรรมที่ 8: Debugging Demo
// ==============================================
function DebugDemo() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => {
    console.log(msg);
    setLog((prev) => [...prev, msg]);
  };

  const riskyFetch = async () => {
    try {
      addLog("กำลังเรียก API...");
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      addLog("สำเร็จ: " + JSON.stringify(json.title));
    } catch (e: any) {
      console.error("API Error:", e);
      addLog("Error: " + e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.pad}>
      <Text style={s.h}>กิจกรรม 8: Debugging (console.log / try-catch)</Text>
      <PrimaryButton title="เรียก API (ดู Console)" onPress={riskyFetch} />
      {log.map((l, i) => (
        <Text key={i} style={s.sub}>
          • {l}
        </Text>
      ))}
    </ScrollView>
  );
}

// ==============================================
// กิจกรรมที่ 10: UI States
// ==============================================
type LoadState = "loading" | "success" | "empty" | "error";

function UIStateDemo() {
  const [state, setState] = useState<LoadState>("loading");
  const [items, setItems] = useState<{ id: string; title: string }[]>([]);
  const [shouldFail, setShouldFail] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setState("loading");
      await new Promise((r) => setTimeout(r, 1200));
      if (shouldFail) throw new Error("ไม่สามารถโหลดข้อมูลได้");
      const data = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=8",
      ).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
      const mapped = data.map((d: any) => ({
        id: String(d.id),
        title: d.title,
      }));
      setItems(mapped);
      setState(mapped.length > 0 ? "success" : "empty");
    } catch (e) {
      console.error("loadData error:", e);
      setState("error");
    }
  }, [shouldFail]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={s.pad}>
      <Text style={s.h}>กิจกรรม 10: UI States</Text>
      <Pressable style={s.switch} onPress={() => setShouldFail(!shouldFail)}>
        <Text style={s.sub}>
          สลับโหมดล้มเหลว: {shouldFail ? "เปิด" : "ปิด"}
        </Text>
      </Pressable>

      {state === "loading" && (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={s.sub}>กำลังโหลดข้อมูล...</Text>
        </View>
      )}

      {state === "empty" && (
        <View style={s.center}>
          <Text style={s.emoji}>📝</Text>
          <Text style={s.sub}>ยังไม่มีงาน เริ่มเพิ่มงานแรกของคุณ</Text>
        </View>
      )}

      {state === "error" && (
        <View style={s.center}>
          <Text style={s.emoji}>⚠️</Text>
          <ErrorMessage message="โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่อีกครั้ง" />
          <PrimaryButton title="ลองใหม่" onPress={loadData} />
        </View>
      )}

      {state === "success" && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.cardText}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ==============================================
// กิจกรรมที่ 11: Performance
// ==============================================
function PerformanceDemo() {
  const [all, setAll] = useState<
    { id: string; title: string; completed: boolean }[]
  >([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
      ).then((r) => r.json());
      if (!cancelled) {
        setAll(
          data.map((d: any) => ({
            id: String(d.id),
            title: d.title,
            completed: d.completed,
          })),
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = filterTasks(all, keyword, "all");

  return (
    <View style={s.pad}>
      <Text style={s.h}>กิจกรรม 11: Performance (FlatList)</Text>
      <TextInput
        style={s.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="ค้นหางาน..."
      />
      {loading ? (
        <ActivityIndicator color="#4285F4" />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(item) => item.id}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={7}
          ListEmptyComponent={<Text style={s.sub}>ไม่พบรายการที่ค้นหา</Text>}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={[s.cardText, item.completed && s.done]}>
                {item.title}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ==============================================
// เมนูหลัก
// ==============================================
const DEMOS = [
  { key: "validators", label: "กิจกรรม 5-6: Validators + Unit Test" },
  { key: "component", label: "กิจกรรม 7: Component Test Demo" },
  { key: "debug", label: "กิจกรรม 8: Debugging" },
  { key: "uistate", label: "กิจกรรม 10: UI States" },
  { key: "perf", label: "กิจกรรม 11: Performance" },
] as const;

export default function App() {
  const [screen, setScreen] = useState<string | null>(null);

  if (screen === null) {
    return (
      <ScrollView contentContainerStyle={s.menu}>
        <Text style={s.h}>Lab 14: Testing & Debugging App</Text>
        <Text style={s.sub}>เลือกกิจกรรมที่ต้องการดู</Text>
        {DEMOS.map((d) => (
          <PrimaryButton
            key={d.key}
            title={d.label}
            onPress={() => setScreen(d.key)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={s.flex}>
      <View style={s.topBar}>
        <Pressable onPress={() => setScreen(null)}>
          <Text style={s.back}>← เมนู</Text>
        </Pressable>
      </View>
      {screen === "validators" && <ValidatorsDemo />}
      {screen === "component" && <ComponentDemo />}
      {screen === "debug" && <DebugDemo />}
      {screen === "uistate" && <UIStateDemo />}
      {screen === "perf" && <PerformanceDemo />}
    </View>
  );
}

// ==============================================
const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  menu: { padding: 24, paddingTop: 64, gap: 12 },
  pad: { padding: 20, gap: 10, flexGrow: 1 },
  h: { fontSize: 20, fontWeight: "bold", color: "#1F3B63", marginBottom: 8 },
  sub: { fontSize: 14, color: "#555" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  err: { color: "#D32F2F", fontSize: 13 },
  ok: { color: "#2E7D32", fontSize: 13 },
  errBox: {
    backgroundColor: "#FDECEA",
    color: "#B71C1C",
    padding: 12,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 8,
  },
  successBox: {
    backgroundColor: "#E6F4EA",
    color: "#137333",
    padding: 12,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 8,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 14,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: { fontSize: 15, flex: 1 },
  done: { textDecorationLine: "line-through", color: "#999" },
  badge: { fontSize: 12, color: "#4285F4" },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emoji: { fontSize: 44 },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#F4F6FA",
  },
  back: { fontSize: 16, color: "#4285F4", fontWeight: "600" },
  switch: { backgroundColor: "#E8F0FE", padding: 10, borderRadius: 10 },
});
