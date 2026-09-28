// src/tests/PrimaryButton.test.tsx — กิจกรรมที่ 7 (Component Test)
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import PrimaryButton from '../components/PrimaryButton';

test('แสดงข้อความบนปุ่มถูกต้อง', () => {
  const { getByText } = render(
    <PrimaryButton title="บันทึกข้อมูล" onPress={() => {}} />
  );
  expect(getByText('บันทึกข้อมูล')).toBeTruthy();
});

test('เรียก onPress เมื่อกดปุ่ม', () => {
  const mockPress = jest.fn();
  const { getByText } = render(
    <PrimaryButton title="บันทึกข้อมูล" onPress={mockPress} />
  );
  fireEvent.press(getByText('บันทึกข้อมูล'));
  expect(mockPress).toHaveBeenCalled();
  expect(mockPress).toHaveBeenCalledTimes(1);
});

test('ไม่เรียก onPress เมื่อ disabled', () => {
  const mockPress = jest.fn();
  const { getByText } = render(
    <PrimaryButton title="บันทึกข้อมูล" onPress={mockPress} disabled />
  );
  fireEvent.press(getByText('บันทึกข้อมูล'));
  expect(mockPress).not.toHaveBeenCalled();
});