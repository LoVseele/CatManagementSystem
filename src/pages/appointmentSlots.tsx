// src/pages/AppointmentSlots.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from 'antd';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchSlots,
  addSlot,
  updateSlot,
  deleteSlot,
} from '../slices/appointmentSlotsSlice';
import type { AppointmentSlot } from '../types';

export default function AppointmentSlots() {
  const dispatch = useAppDispatch();
  const { list: slots, loading } = useAppSelector(
    (s: any) => s.appointmentSlots
  );

  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<AppointmentSlot | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  const openNew = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const openEdit = (row: AppointmentSlot) => {
    setEditing(row);
    form.setFieldsValue(row);
    setVisible(true);
  };

  const doDelete = async (id?: number) => {
    if (!id) return;
    await dispatch(deleteSlot(id as number));
    message.success('删除成功');
    dispatch(fetchSlots());
  };

  const submit = async () => {
    try {
      const vals = await form.validateFields();
      // vals: interviewDate, interviewTime, interviewNumber, interviewCurrentNumber, direction
      if (editing) {
        await dispatch(updateSlot({ ...editing, ...vals } as AppointmentSlot));
        message.success('更新成功');
      } else {
        await dispatch(
          addSlot({
            ...vals,
            interviewCurrentNumber: vals.interviewCurrentNumber || 0,
          } as AppointmentSlot)
        );
        message.success('新增成功');
      }
      setVisible(false);
      dispatch(fetchSlots());
    } catch (e: any) {
      message.error('保存失败');
    }
  };

  const columns = [
    { title: '日期', dataIndex: 'interviewDate', key: 'interviewDate' },
    { title: '时间段', dataIndex: 'interviewTime', key: 'interviewTime' },
    { title: '方向', dataIndex: 'direction', key: 'direction' },
    { title: '人数上限', dataIndex: 'interviewNumber', key: 'interviewNumber' },
    {
      title: '当前预约数',
      dataIndex: 'interviewCurrentNumber',
      key: 'interviewCurrentNumber',
    },
    {
      title: '操作',
      key: 'op',
      render: (_: any, row: AppointmentSlot) => (
        <>
          <Button onClick={() => openEdit(row)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => doDelete(row.id)}>
            <Button danger style={{ marginLeft: 8 }}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>预约时间段管理</h2>
      <Button type="primary" onClick={openNew} style={{ marginBottom: 12 }}>
        新增时间段
      </Button>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={slots}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={visible}
        title={editing ? '编辑时间段' : '新增时间段'}
        onCancel={() => setVisible(false)}
        onOk={submit}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ interviewCurrentNumber: 0, interviewNumber: 1 }}
        >
          <Form.Item
            name="interviewDate"
            label="日期"
            rules={[{ required: true }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="interviewTime"
            label="时间段"
            rules={[{ required: true }]}
          >
            <Input placeholder="如 09:00-10:00" />
          </Form.Item>
          <Form.Item name="direction" label="方向" rules={[{ required: true }]}>
            <Input placeholder="前端 / 后端" />
          </Form.Item>
          <Form.Item
            name="interviewNumber"
            label="人数上限"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="interviewCurrentNumber" label="当前预约数">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
