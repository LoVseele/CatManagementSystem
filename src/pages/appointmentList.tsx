// src/pages/Appointments.tsx
import { useEffect, useState, useMemo } from 'react';
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
  Select,
  DatePicker,
  ConfigProvider,
  Card,
  Pagination,
  Tabs,
} from 'antd';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchSlots,
  addSlot,
  updateSlot,
  deleteSlot,
} from '../slices/appointmentSlotsSlice';
import {
  fetchAppointments,
  deleteAppointment,
} from '../slices/appointmentsSlice';
import { fetchUsers } from '../slices/usersSlice';
import type { AppointmentSlot, Appointment } from '../types';

const { Option } = Select;
const { TabPane } = Tabs;

export default function Appointments() {
  const dispatch = useAppDispatch();

  // slot state
  const { list: slots, loading: slotLoading } = useAppSelector(
    (s: any) => s.appointmentSlots
  );
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<AppointmentSlot | null>(null);
  const [form] = Form.useForm();

  // appointment state
  const { list: appts, loading: apptLoading } = useAppSelector(
    (s: any) => s.appointments
  );
  const { list: users } = useAppSelector((s: any) => s.users);

  const [direction, setDirection] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // fetch data
  useEffect(() => {
    dispatch(fetchSlots());
    dispatch(fetchAppointments());
    dispatch(fetchUsers());
  }, [dispatch]);

  // ---- slots ----
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
  const doDeleteSlot = async (id?: number) => {
    if (!id) return;
    await dispatch(deleteSlot(id as number));
    message.success('删除成功');
    dispatch(fetchSlots());
  };
  const submitSlot = async () => {
    try {
      const vals = await form.validateFields();
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
    } catch {
      message.error('保存失败');
    }
  };
  const slotColumns = [
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
          <Popconfirm title="确认删除？" onConfirm={() => doDeleteSlot(row.id)}>
            <Button danger style={{ marginLeft: 8 }}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // ---- appointments ----
  const handleDeleteAppt = async (id: number) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      message.success('删除成功');
      dispatch(fetchAppointments());
      dispatch(fetchSlots());
    } catch {
      message.error('删除失败');
    }
  };

  const apptData = useMemo(() => {
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

  const apptColumns = [
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
        <Popconfirm
          title="确认删除？"
          onConfirm={() => handleDeleteAppt(record.id)}
        >
          <Button danger>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: 'rgba(253, 178, 2, 1)' },
      }}
    >
      <Card>
        <Tabs defaultActiveKey="slots">
          <TabPane tab="预约管理" key="appts">
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
                onChange={(d) =>
                  setDate(d ? dayjs(d).format('YYYY-MM-DD') : null)
                }
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
              loading={apptLoading}
              dataSource={apptData.slice((page - 1) * 6, page * 6)}
              columns={apptColumns}
              pagination={false}
              style={{ height: '60vh' }}
            />
            <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
              <Pagination
                current={page}
                pageSize={6}
                total={apptData.length}
                onChange={setPage}
                style={{ marginTop: 12, textAlign: 'right' }}
              />
            </div>
          </TabPane>
          <TabPane tab="时间段管理" key="slots">
            <Button
              type="primary"
              onClick={openNew}
              style={{ marginBottom: 12 }}
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
          </TabPane>
        </Tabs>
      </Card>

      {/* slot form modal */}
      <Modal
        open={visible}
        title={editing ? '编辑时间段' : '新增时间段'}
        onCancel={() => setVisible(false)}
        onOk={submitSlot}
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
    </ConfigProvider>
  );
}
