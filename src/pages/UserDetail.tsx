import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Select,
  List,
  Form,
  InputNumber,
  Input,
  message,
  Modal,
  Space,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUserById, updateUserProgress } from '../slices/usersSlice';
import {
  fetchScoresByUser,
  addScore,
  editScore,
  deleteScore,
} from '../slices/scoresSlice';

const { Option } = Select;

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loading } = useAppSelector((s) => s.users);
  const { items: scores, loading: scoresLoading } = useAppSelector(
    (s: any) => s.scores
  );
  const auth = useAppSelector((s: any) => s.auth);
  const [form] = Form.useForm();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      dispatch(fetchScoresByUser(id));
    }
  }, [id, dispatch]);

  const handleProgressChange = async (value: string) => {
    if (!id) return;
    try {
      await dispatch(updateUserProgress({ id, progress: value }));
      message.success('进度已更新');
      dispatch(fetchUserById(id));
    } catch (e) {
      message.error('更新失败');
    }
  };

  const onFinish = async (values: any) => {
    if (!id) return;
    const payload = {
      userId: id,
      round: values.round,
      score: values.score,
      comment: values.comment || '',
      adminName: auth.adminName || '管理员',
    };
    try {
      await dispatch(addScore(payload as any));
      message.success('评分已添加');
      form.resetFields();
      dispatch(fetchScoresByUser(id));
    } catch (e) {
      message.error('添加评分失败');
    }
  };

  const doEdit = (s: any) => {
    setEditingScore(s);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (vals: any) => {
    if (!editingScore) return;
    try {
      await dispatch(editScore({ ...editingScore, ...vals }));
      message.success('评分已更新');
      setEditModalOpen(false);
      setEditingScore(null);
      if (id) {
        dispatch(fetchScoresByUser(id));
      } else {
        message.error('用户ID不存在，无法刷新评分列表');
      }
    } catch (e) {
      message.error('更新评分失败');
    }
  };

  const handleDelete = async (s: any) => {
    Modal.confirm({
      title: '确认删除该评分？',
      onOk: async () => {
        try {
          await dispatch(deleteScore(s.id));
          message.success('删除成功');
          if (id) {
            dispatch(fetchScoresByUser(id));
          } else {
            message.error('用户ID不存在，无法刷新评分列表');
          }
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  if (loading) return <Card loading={true} />;

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="用户详情"
        extra={<Button onClick={() => navigate(-1)}>返回</Button>}
      >
        {current ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="姓名">
              {current.userName}
            </Descriptions.Item>
            <Descriptions.Item label="openId">
              {current.openId}
            </Descriptions.Item>
            <Descriptions.Item label="学号">
              {current.userNumber}
            </Descriptions.Item>
            <Descriptions.Item label="学院专业班级">
              {current.academy}
            </Descriptions.Item>
            <Descriptions.Item label="学习方向">
              <Tag>{current.direction}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="进度">
              <Tag>{current.progress || '未开始'}</Tag>
              {auth && auth.token && (
                <Select
                  defaultValue={current.progress}
                  style={{ width: 160, marginLeft: 12 }}
                  onChange={handleProgressChange}
                >
                  <Option value="一轮考核">一轮考核</Option>
                  <Option value="二轮考核">二轮考核</Option>
                  <Option value="面试">面试</Option>
                  <Option value="未通过">未通过</Option>
                </Select>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="个人简介">
              {current.userIntro}
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">
              手机：{current.phoneNumber} <br />
              邮箱：{current.email}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Card>

      <Card title="评分记录" style={{ marginTop: 20 }} loading={scoresLoading}>
        <List
          dataSource={scores}
          renderItem={(s: any) => (
            <List.Item
              actions={
                auth && auth.token
                  ? [
                      <Button key="edit" type="link" onClick={() => doEdit(s)}>
                        编辑
                      </Button>,
                      <Button
                        key="del"
                        type="link"
                        danger
                        onClick={() => handleDelete(s)}
                      >
                        删除
                      </Button>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={`${s.round} — ${s.score} 分 （评分人：${s.adminName}）`}
                description={s.comment}
              />
            </List.Item>
          )}
        />
      </Card>

      {auth && auth.token && (
        <Card title="添加评分" style={{ marginTop: 20 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="round"
              label="考核轮次"
              rules={[{ required: true, message: '请输入考核轮次' }]}
            >
              <Input placeholder="如：一轮考核" />
            </Form.Item>
            <Form.Item
              name="score"
              label="分数"
              rules={[{ required: true, message: '请输入分数' }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="comment" label="评价">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交评分
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Modal
        open={editModalOpen}
        title="编辑评分"
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        {editingScore && (
          <Form
            initialValues={editingScore}
            onFinish={handleEditSubmit}
            layout="vertical"
          >
            <Form.Item
              name="round"
              label="考核轮次"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="score" label="分数" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="comment" label="评价">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => setEditModalOpen(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
