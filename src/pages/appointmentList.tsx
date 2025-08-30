// src/pages/AppointmentsList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Space,
  Select,
  DatePicker,
  Button,
  Popconfirm,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchAppointments,
  deleteAppointment,
} from '../slices/appointmentsSlice';
import { fetchSlots } from '../slices/appointmentSlotsSlice';
import { fetchUsers } from '../slices/usersSlice'; // 假设你已有 fetchUsers
import type { Appointment } from '../types';

const { Option } = Select;

export default function AppointmentsList() {
  const dispatch = useAppDispatch();
  const { list: appts, loading } = useAppSelector((s: any) => s.appointments);
  const { list: slots } = useAppSelector((s: any) => s.appointmentSlots);
  const { list: users } = useAppSelector((s: any) => s.users);

  const [direction, setDirection] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchSlots());
    dispatch(fetchUsers()); // 加载用户列表以解析 userName
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      message.success('删除成功');
      // refresh
      dispatch(fetchAppointments());
      dispatch(fetchSlots());
    } catch (e) {
      message.error('删除失败');
    }
  };

  const data = useMemo(() => {
    return appts
      .filter((a: Appointment) => {
        return (
          (!direction || a.direction === direction) &&
          (!date || a.interviewDate === date) &&
          (!typeFilter || a.type === typeFilter)
        );
      })
      .map((a: any) => {
        const user = users.find((u: any) => u.openId === a.openId);
        return {
          ...a,
          userName: user?.userName || '未知',
        };
      });
  }, [appts, direction, date, typeFilter, users]);

  const columns = [
    { title: '姓名', dataIndex: 'userName', key: 'userName' },
    { title: 'openId', dataIndex: 'openId', key: 'openId' },
    { title: '方向', dataIndex: 'direction', key: 'direction' },
    { title: '预约日期', dataIndex: 'interviewDate', key: 'interviewDate' },
    { title: '预约时段', dataIndex: 'interviewTime', key: 'interviewTime' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    {
      title: '操作',
      key: 'op',
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>预约管理（管理员）</h2>
      <Space style={{ marginBottom: 12 }}>
        <Select
          placeholder="方向"
          allowClear
          style={{ width: 120 }}
          onChange={(v) => setDirection(v || null)}
        >
          <Option value="前端">前端</Option>
          <Option value="后端">后端</Option>
        </Select>
        <DatePicker
          onChange={(d) => setDate(d ? dayjs(d).format('YYYY-MM-DD') : null)}
          placeholder="日期"
        />
        <Select
          placeholder="类型"
          allowClear
          style={{ width: 140 }}
          onChange={(v) => setTypeFilter(v || null)}
        >
          <Option value="面试">面试</Option>
          <Option value="一轮考核">一轮考核</Option>
          <Option value="二轮考核">二轮考核</Option>
        </Select>
        <Button
          onClick={() => {
            setDirection(null);
            setDate(null);
            setTypeFilter(null);
          }}
        >
          重置
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}
