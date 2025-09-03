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
  const [form] = Form.useForm();

  // 从 Redux store 获取预约时间段（slots）列表和加载状态
  const { list: slots, loading: slotLoading } = useAppSelector(
    (s: any) => s.appointmentSlots
  );
  // 控制新增/编辑弹窗的显示状态
  const [visible, setVisible] = useState(false);
  // 存储当前正在编辑的时间段信息，如果为 null 则表示是新增操作
  const [editing, setEditing] = useState<AppointmentSlot | null>(null);

  // 从 Redux store 获取预约记录（appointments）列表和加载状态
  const { list: appts, loading: apptLoading } = useAppSelector(
    (s: any) => s.appointments
  );
  // 从 Redux store 获取用户列表，用于将 openId 映射为用户名
  const { list: users } = useAppSelector((s: any) => s.users);

  // 用于筛选预约记录的 state
  const [direction, setDirection] = useState<string | null>(null); // 方向筛选
  const [date, setDate] = useState<string | null>(null); // 日期筛选
  const [typeFilter, setTypeFilter] = useState<string | null>(null); // 类型筛选
  const [page, setPage] = useState(1); // 分页状态

  // ----------------- 数据获取 -----------------

  // 组件首次加载时，从服务器获取所有需要的数据
  useEffect(() => {
    dispatch(fetchSlots()); // 获取所有可预约时间段
    dispatch(fetchAppointments()); // 获取所有预约记录
    dispatch(fetchUsers()); // 获取所有用户信息
  }, [dispatch]);

  // ----------------- 时间段管理 (Slots) -----------------

  // 打开“新增时间段”弹窗
  const openNew = () => {
    setEditing(null); // 清空编辑状态
    form.resetFields(); // 重置表单
    setVisible(true); // 显示弹窗
  };

  // 打开“编辑时间段”弹窗
  const openEdit = (row: AppointmentSlot) => {
    setEditing(row); // 设置当前编辑的行数据
    form.setFieldsValue(row); // 将行数据填充到表单中
    setVisible(true); // 显示弹窗
  };

  // 处理删除时间段的逻辑
  const doDeleteSlot = async (id?: number) => {
    if (!id) return;
    await dispatch(deleteSlot(id as number));
    message.success('删除成功');
    dispatch(fetchSlots()); // 重新获取数据以刷新列表
  };

  // 提交新增或编辑的时间段表单
  const submitSlot = async () => {
    try {
      const vals = await form.validateFields(); // 触发表单验证
      if (editing) {
        // 如果是编辑模式，则调用更新接口
        await dispatch(updateSlot({ ...editing, ...vals } as AppointmentSlot));
        message.success('更新成功');
      } else {
        // 如果是新增模式，则调用新增接口
        await dispatch(
          addSlot({
            ...vals,
            interviewCurrentNumber: vals.interviewCurrentNumber || 0, // 确保新创建的时段当前人数不为 undefined
          } as AppointmentSlot)
        );
        message.success('新增成功');
      }
      setVisible(false); // 关闭弹窗
      dispatch(fetchSlots()); // 重新获取数据以刷新列表
    } catch {
      message.error('保存失败');
    }
  };

  // “时间段管理”表格的列定义
  const slotColumns = [
    { title: '日期', dataIndex: 'interviewDate', key: 'interviewDate' },
    {
      title: '开始时间',
      dataIndex: 'interviewStartTime',
      key: 'interviewStartTime',
    },
    {
      title: '结束时间',
      dataIndex: 'interviewEndTime',
      key: 'interviewEndTime',
    },
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

  // ----------------- 预约记录管理 (Appointments) -----------------

  // 处理删除预约记录的逻辑
  const handleDeleteAppt = async (id: number) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap(); // unwrap 可以获取 thunk 的真实结果
      message.success('删除成功');
      // 成功后重新获取预约记录和时间段列表来刷新数据
      dispatch(fetchAppointments());
      dispatch(fetchSlots());
    } catch {
      message.error('删除失败');
    }
  };

  // 使用 useMemo 对预约数据进行筛选和处理，避免不必要的重复计算
  const apptData = useMemo(() => {
    return appts
      .filter((a: Appointment) => {
        // 根据方向、日期和类型进行筛选
        return (
          (!direction || a.direction === direction) &&
          (!date || a.interviewDate === date) &&
          (!typeFilter || a.type === typeFilter)
        );
      })
      .map((a: any) => {
        // 找到预约记录对应的用户信息，将 openId 转换为用户名
        const user = users.find((u: any) => u.openId === a.openId);
        return {
          ...a,
          userName: user?.userName || '未知',
        };
      });
  }, [appts, direction, date, typeFilter, users]);

  // “预约管理”表格的列定义
  const apptColumns = [
    { title: '姓名', dataIndex: 'userName', key: 'userName' },
    { title: 'openId', dataIndex: 'openId', key: 'openId' },
    { title: '方向', dataIndex: 'direction', key: 'direction' },
    { title: '预约日期', dataIndex: 'interviewDate', key: 'interviewDate' },
    {
      title: '开始时间',
      dataIndex: 'interviewStartTime',
      key: 'interviewStartTime',
    },
    {
      title: '结束时间',
      dataIndex: 'interviewEndTime',
      key: 'interviewEndTime',
    },
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

  // ----------------- 渲染 JSX -----------------

  return (
    // antd 配置提供器，用于定制主题颜色
    <ConfigProvider
      theme={{
        token: { colorPrimary: 'rgba(253, 178, 2, 1)' },
      }}
    >
      <Card>
        {/* Tabs 用于在“预约管理”和“时间段管理”之间切换 */}
        <Tabs defaultActiveKey="slots">
          <TabPane tab="预约管理" key="appts">
            {/* 筛选控件区域 */}
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

            {/* 预约记录表格 */}
            <Table
              rowKey="id"
              loading={apptLoading}
              dataSource={apptData.slice((page - 1) * 6, page * 6)} // 手动实现前端分页
              columns={apptColumns}
              pagination={false} // 禁用表格自带分页，使用下方的 Pagination 组件
              style={{ height: '60vh' }}
            />
            {/* 自定义分页组件 */}
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
            {/* 时间段管理表格 */}
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

      {/* 新增/编辑时间段的弹窗 */}
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
            name="interviewStartTime"
            label="开始时间"
            rules={[{ required: true }]}
          >
            <Input placeholder="如 09:00" />
          </Form.Item>
          <Form.Item
            name="interviewEndTime"
            label="结束时间"
            rules={[{ required: true }]}
          >
            <Input placeholder="如 10:00" />
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
