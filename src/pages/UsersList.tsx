import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Button,
  Typography,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUsers } from '../slices/usersSlice';
import { useNavigate } from 'react-router-dom';

export default function UsersList() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.users);
  const [keyword, setKeyword] = useState('');
  const [direction, setDirection] = useState<'全部' | '前端' | '后端'>('全部');
  const [progress, setProgress] = useState<
    '全部' | '一轮考核' | '二轮考核' | '面试' | '未通过'
  >('全部');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return list.filter((u: any) => {
      const searchable = `${u.userName} ${u.academy} ${u.userNumber}`;
      const matchKeyword = !keyword || searchable.includes(keyword);
      const matchDirection =
        direction === '全部' ? true : u.direction === direction;
      const matchProgress =
        progress === '全部' ? true : (u.progress || '') === progress;
      return matchKeyword && matchDirection && matchProgress;
    });
  }, [list, keyword, direction, progress]);

  const columns = [
    { title: '名字', dataIndex: 'userName', key: 'name' },
    { title: '学号', dataIndex: 'userNumber', key: 'number' },
    { title: '学院/专业/班级', dataIndex: 'academy', key: 'academy' },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/users/${record.id}`)}
            style={{ color: 'rgba(250, 132, 35, 1) ' }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="用户列表">
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索名字、学院、学号..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
          style={{ width: 240 }}
        />
        <Select
          value={direction}
          style={{ width: 160 }}
          onChange={setDirection}
          options={[
            { value: '全部', label: '全部' },
            { value: '前端', label: '前端' },
            { value: '后端', label: '后端' },
          ]}
        />
        <Select
          value={progress}
          style={{ width: 160 }}
          onChange={setProgress}
          options={[
            { value: '全部', label: '全部' },
            { value: '一轮考核', label: '一轮考核' },
            { value: '二轮考核', label: '二轮考核' },
            { value: '面试', label: '面试' },
            { value: '未通过', label: '未通过' },
          ]}
        />
        <Button
          onClick={() => {
            setKeyword('');
            setDirection('全部');
            setProgress('全部');
          }}
        >
          重置
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns as any}
        dataSource={filtered}
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
}
