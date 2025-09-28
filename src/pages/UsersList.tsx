// lovseele/catmanagementsystem/CatManagementSystem-feat/src/pages/UsersList.tsx

import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Button,
  Pagination,
  ConfigProvider,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUsers } from '../slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

// 单页能展示的最大数据量
const PAGE_SIZE = 6;

// 状态定义
export const statusOptions = [
  { value: '', label: '全部进度' },
  { value: '未报名', label: '未报名' },
  { value: '已报名', label: '已报名' },
  { value: '已淘汰', label: '已淘汰' },
  { value: '初面', label: '初面' },
  { value: '初面通过', label: '初面通过' },
  { value: '一面', label: '一面' },
  { value: '一轮考核通过', label: '一轮考核通过' },
  { value: '二面', label: '二面' },
  { value: '二轮考核通过', label: '二轮考核通过' },
  { value: '已通过', label: '已通过' },
];

export default function UsersList() {
  const dispatch = useAppDispatch();
  const { list: allUsers, loading } = useAppSelector((s) => s.users);
  const navigate = useNavigate();

  // 实时输入值
  const [keyword, setKeyword] = useState('');
  // 防抖用值
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const [direction, setDirection] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchUsers({ pageNum: 1, pageSize: 99, direction: '', status: '' })
    );
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    // 清除上一个定时器
    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  // 数据筛选
  const filteredData = useMemo(() => {
    if (!Array.isArray(allUsers)) {
      return [];
    }
    return allUsers.filter((u) => {
      const matchKeyword = `${u.name || ''}${u.academy || ''}${
        u.userNumber || ''
      }`
        .toLowerCase()
        .includes(debouncedKeyword.toLowerCase());
      const matchDirection = !direction || u.direction === direction;
      const matchStatus = !status || u.state === status;
      return matchKeyword && matchDirection && matchStatus;
    });
  }, [allUsers, debouncedKeyword, direction, status]);

  //  对筛选后的结果 (filteredData) 进行前端分页
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, page]);

  const columns = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: '学号',
      dataIndex: 'userNumber',
      key: 'userNumber',
      render: (text: string) => text || '-',
    },
    {
      title: '学院/专业/班级',
      dataIndex: 'academy',
      key: 'academy',
      render: (text: string) => text || '-',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (v: string) => (v ? <Tag>{v}</Tag> : '-'),
    },
    {
      title: '进度',
      dataIndex: 'state',
      key: 'state',
      render: (v: string) => (v ? <Tag>{v}</Tag> : '未开始'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/users/${record.userId}`)}
            style={{ color: 'rgba(250, 132, 35, 1) ' }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: 'rgba(253, 178, 2, 1)' } }}>
      <Card title="用户列表">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索名字、学院、学号..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 240 }}
          />

          <Select
            value={direction}
            style={{ width: 160 }}
            onChange={(value) => {
              setDirection(value);
              setPage(1);
            }}
            options={[
              { value: '', label: '全部方向' },
              { value: '前端', label: '前端' },
              { value: '后端', label: '后端' },
            ]}
          />
          <Select
            value={status}
            style={{ width: 160 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statusOptions}
          />
          <Button
            onClick={() => {
              setKeyword('');
              setDirection('');
              setStatus('');
              setPage(1);
            }}
          >
            重置
          </Button>
        </Space>
        <Table
          rowKey="userId"
          loading={loading && !allUsers.length}
          columns={columns as any}
          dataSource={paginatedData}
          pagination={false}
          style={{ height: '60vh' }}
        />
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
