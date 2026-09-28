// components/PrimaryButton.tsx — กิจกรรมที่ 7
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4285F4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  disabled: { backgroundColor: "#A9C4F5" },
  text: { color: "#FFFFFF", fontSize: 17, fontWeight: "bold" },
});
