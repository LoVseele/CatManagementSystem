// lovseele/catmanagementsystem/CatManagementSystem-feat/src/pages/appointmentList.tsx

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  ConfigProvider,
  Card,
  Alert,
  Select,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchSlots,
  addSlot,
  updateSlot,
  deleteSlot,
} from '../slices/appointmentSlotsSlice';
import {
  fetchAppointmentsBySlot,
  clearAppointments,
} from '../slices/appointmentsSlice';
import type { AppointmentSlot } from '../types';

export default function AppointmentPage() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // --- State for Time Slots ---
  const { list: slots, loading: slotLoading } = useAppSelector(
    (s) => s.appointmentSlots
  );
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AppointmentSlot | null>(null);

  // --- State for Booked Appointments (Users) ---
  const { list: appointments, loading: apptLoading } = useAppSelector(
    (s) => s.appointments
  );
  const [bookingsModalVisible, setBookingsModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(
    null
  );

  // Initial data fetch for slots
  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  // --- Time Slot Management Logic ---

  const handleOpenSlotModal = (slot: AppointmentSlot | null) => {
    setEditingSlot(slot);
    // 使用接口文档中的字段来设置表单值
    form.setFieldsValue(
      slot || {
        direction: '前端',
        accessType: '一面',
        capacity: 10,
      }
    );
    setSlotModalVisible(true);
  };

  const handleCloseSlotModal = () => {
    setSlotModalVisible(false);
    setEditingSlot(null);
    form.resetFields();
  };

  const handleSubmitSlot = async () => {
    try {
      const values = await form.validateFields();
      // 确保 payload 结构与 AppointmentSlot 类型匹配
      const payload: AppointmentSlot = {
        ...(editingSlot || {}),
        ...values,
      };

      let resultAction;
      if (editingSlot && editingSlot.id) {
        // 更新操作需要 id
        resultAction = await dispatch(updateSlot(payload));
      } else {
        // 新增操作不需要 id
        const { id, ...addPayload } = payload;
        resultAction = await dispatch(addSlot(addPayload as any));
      }

      if (
        updateSlot.fulfilled.match(resultAction) ||
        addSlot.fulfilled.match(resultAction)
      ) {
        message.success(editingSlot ? '更新成功' : '新增成功');
        handleCloseSlotModal();
        dispatch(fetchSlots()); // Refresh the list
      } else {
        // 处理 thunk reject 的情况
        const errorMessage = (resultAction.payload as string) || '操作失败';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      // 捕获校验错误或 thunk 抛出的错误
      message.error(err.message || '保存失败，请检查表单输入。');
    }
  };

  const handleDeleteSlot = async (id: number) => {
    await dispatch(deleteSlot(id));
    message.success('删除成功');
  };

  // --- Appointment Bookings Logic ---

  const handleOpenBookingsModal = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    dispatch(fetchAppointmentsBySlot(slot.id!));
    setBookingsModalVisible(true);
  };

  const handleCloseBookingsModal = () => {
    setBookingsModalVisible(false);
    setSelectedSlot(null);
    dispatch(clearAppointments()); // Clear the list when modal closes
  };

  // --- Column Definitions ---

  const slotColumns = [
    { title: '考核类型', dataIndex: 'accessType', key: 'accessType' },
    { title: '日期', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { title: '方向', dataIndex: 'direction', key: 'direction' },
    { title: '人数上限', dataIndex: 'capacity', key: 'capacity' },
    { title: '当前预约数', dataIndex: 'appointedCount', key: 'appointedCount' },
    {
      title: '操作',
      key: 'op',
      render: (_: any, slot: AppointmentSlot) => (
        <Space>
          <Button type="primary" onClick={() => handleOpenBookingsModal(slot)}>
            查看预约
          </Button>
          <Button onClick={() => handleOpenSlotModal(slot)}>编辑</Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDeleteSlot(slot.id!)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '学号', dataIndex: 'userNumber', key: 'userNumber' },
    { title: '学院', dataIndex: 'academy', key: 'academy' },
    { title: '联系电话', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: 'rgba(253, 178, 2, 1)' } }}>
      <Card title="时间段管理">
        <Button
          type="primary"
          onClick={() => handleOpenSlotModal(null)}
          style={{ marginBottom: 16 }}
        >
          新增时间段
        </Button>
        <Table
          rowKey="id"
          loading={slotLoading}
          dataSource={slots}
          columns={slotColumns}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Add/Edit Slot Modal */}
      <Modal
        open={slotModalVisible}
        title={editingSlot ? '编辑时间段' : '新增时间段'}
        onCancel={handleCloseSlotModal}
        onOk={handleSubmitSlot}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            direction: '前端',
            accessType: '一面',
            capacity: 10,
          }}
        >
          <Form.Item
            name="accessType"
            label="考核类型"
            rules={[{ required: true, message: '请输入考核类型' }]}
          >
            <Input placeholder="例如：初面、一轮考核、二轮考核" />
          </Form.Item>
          <Form.Item
            name="appointmentDate"
            label="日期"
            rules={[{ required: true, message: '请输入日期' }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请输入开始时间' }]}
          >
            <Input placeholder="HH:MM:SS" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请输入结束时间' }]}
          >
            <Input placeholder="HH:MM:SS" />
          </Form.Item>
          <Form.Item
            name="direction"
            label="方向"
            rules={[{ required: true, message: '请选择方向' }]}
          >
            <Select>
              <Select.Option value="前端">前端</Select.Option>
              <Select.Option value="后端">后端</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="人数上限"
            rules={[{ required: true, message: '请输入人数上限' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Bookings Modal */}
      <Modal
        open={bookingsModalVisible}
        title={`“${selectedSlot?.appointmentDate} ${selectedSlot?.startTime}”的预约列表`}
        width={800}
        onCancel={handleCloseBookingsModal}
        footer={[
          <Button key="close" onClick={handleCloseBookingsModal}>
            关闭
          </Button>,
        ]}
      >
        <Table
          rowKey="userId"
          loading={apptLoading}
          dataSource={appointments}
          columns={bookingColumns}
          pagination={false}
        />
      </Modal>
    </ConfigProvider>
  );
}
