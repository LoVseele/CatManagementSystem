// lovseele/catmanagementsystem/CatManagementSystem-feat/src/pages/UserDetail.tsx

import { useEffect } from 'react';
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
  Space,
  ConfigProvider,
  Divider,
  Empty,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUserById, updateUserStatus } from '../slices/usersSlice';
import { fetchAssessmentsByUser, addScore } from '../slices/assessmentSlice';
import type { Score, AssessmentInfo } from '../types';
import { statusOptions } from './UsersList';

const { Option } = Select;

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { current: currentUser, loading: userLoading } = useAppSelector(
    (s) => s.users
  );
  const { assessments, loading: assessmentLoading } = useAppSelector(
    (s) => s.assessment
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      const userId = parseInt(id, 10);
      if (!isNaN(userId)) {
        dispatch(fetchUserById(userId));
        dispatch(fetchAssessmentsByUser(userId));
      }
    }
  }, [id, dispatch]);

  const handleStatusChange = async (newStatus: string) => {
    if (!currentUser) return;
    const resultAction = await dispatch(
      updateUserStatus({ userId: currentUser.userId, status: newStatus })
    );
    if (updateUserStatus.fulfilled.match(resultAction)) {
      message.success('用户状态已更新');
    } else {
      message.error('更新失败');
    }
  };

  const onFinishAddScore = async (values: any, accessId: number) => {
    if (!currentUser) return;
    const payload = {
      accessId: accessId,
      score: values.score,
      comment: values.comment || '',
    };
    const resultAction = await dispatch(addScore(payload));
    if (addScore.fulfilled.match(resultAction)) {
      message.success('评分已成功提交');
      form.resetFields();
      dispatch(fetchAssessmentsByUser(currentUser.userId));
    } else {
      message.error('添加评分失败');
    }
  };

  const handleMockAction = () => {
    message.info('此功能暂未开放，需要等待后端提供相应接口。');
  };

  if (userLoading && !currentUser) {
    return <Card loading={true} style={{ margin: 20 }} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <ConfigProvider
        theme={{ token: { colorPrimary: 'rgba(253, 178, 2, 1)' } }}
      >
        <Card
          title="用户详情"
          extra={<Button onClick={() => navigate(-1)}>返回</Button>}
        >
          {currentUser ? (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="姓名">
                {currentUser.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学号">
                {currentUser.userNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学院/专业/班级">
                {currentUser.academy || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学习方向">
                {currentUser.direction ? (
                  <Tag>{currentUser.direction}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="进度">
                <Space>
                  <Tag>
                    {statusOptions.find((o) => o.value === currentUser.state)
                      ?.label ||
                      currentUser.state ||
                      '未开始'}
                  </Tag>
                  {/*
                    BUG 修复:
                    将 `defaultValue` 修改为 `value`。
                    `defaultValue` 只在组件初次加载时有效，不会随 state 的变化而更新。
                    `value` 会让 Select 组件成为一个受控组件，其显示的值会严格跟随 `currentUser.state` 的变化而变化。
                    这样，当 dispatch 更新状态成功后，`currentUser` 对象改变，Select 的显示也会同步刷新。
                  */}
                  <Select
                    value={currentUser.state}
                    style={{ width: 160 }}
                    onChange={handleStatusChange}
                    loading={userLoading}
                  >
                    {statusOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                手机：{currentUser.phoneNumber || '-'} <br /> 邮箱：
                {currentUser.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="个人简介">
                {currentUser.userIntro || '-'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>未找到该用户的信息。</p>
          )}
        </Card>

        {assessmentLoading ? (
          <Card loading style={{ marginTop: 20 }} />
        ) : (
          assessments.map((assessment: AssessmentInfo) => (
            <Card
              key={assessment.accessId}
              title={`考核阶段: ${assessment.accessType} (${assessment.direction})`}
              style={{ marginTop: 20 }}
            >
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Access ID">
                  {assessment.accessId}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {new Date(assessment.createTime).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Divider>评分记录</Divider>
              <List
                dataSource={assessment.scoreCommentList}
                locale={{ emptyText: <Empty description="暂无评分记录" /> }}
                renderItem={(s: Score) => (
                  <List.Item
                    actions={[
                      <Button key="edit" type="link" onClick={handleMockAction}>
                        编辑
                      </Button>,
                      <Button
                        key="del"
                        type="link"
                        danger
                        onClick={handleMockAction}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`${s.comment} — ${s.score} 分`}
                      description={`评分人: ${s.adminName}`}
                    />
                  </List.Item>
                )}
              />

              <Divider>添加新评分</Divider>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) =>
                  onFinishAddScore(values, assessment.accessId)
                }
              >
                <Form.Item
                  name="score"
                  label="分数"
                  rules={[{ required: true, message: '请输入分数' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="comment" label="评价 (例如：完成度高)">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    为本次考核提交评分
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ))
        )}
      </ConfigProvider>
    </div>
  );
}
