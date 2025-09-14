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
import { fetchUsers } from '../slices/usersSlice'; // 导入重构后的 fetchUsers
import { useNavigate } from 'react-router-dom';
import type { User } from '../types'; // 导入 User 类型

const PAGE_SIZE = 6; // 定义每页大小

export default function UsersList() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.users);
  const navigate = useNavigate();

  // 本地 state 用于筛选和分页
  const [keyword, setKeyword] = useState('');
  const [direction, setDirection] = useState<'全部' | '前端' | '后端'>('全部');
  // 注意：User 类型中没有 progress 字段，暂时用 state 字段代替
  const [progress, setProgress] = useState<string>('全部');
  const [page, setPage] = useState(1);

  // 当页码变化时，从后端获取对应页的数据
  useEffect(() => {
    dispatch(fetchUsers({ pageNum: page, pageSize: PAGE_SIZE }));
  }, [dispatch, page]);

  // 前端筛选逻辑 (临时方案)
  const filteredData = useMemo(() => {
    return list.filter((u: User) => {
      // 根据后端返回的字段进行搜索
      const searchable = `${u.name} ${u.academy} ${u.userNumber}`;
      const matchKeyword =
        !keyword || searchable.toLowerCase().includes(keyword.toLowerCase());
      const matchDirection = direction === '全部' || u.direction === direction;
      // 注意：User 类型中没有 progress 字段，暂时用 state 字段代替筛选
      const matchProgress = progress === '全部' || (u.state || '') === progress;
      return matchKeyword && matchDirection && matchProgress;
    });
  }, [list, keyword, direction, progress]);

  // 更新 Table columns 以匹配新的 User 类型
  const columns = [
    { title: '名字', dataIndex: 'name', key: 'name' },
    { title: '学号', dataIndex: 'userNumber', key: 'userNumber' },
    { title: '学院/专业/班级', dataIndex: 'academy', key: 'academy' },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (v: string) => (v ? <Tag>{v}</Tag> : '-'),
    },
    {
      title: '进度',
      dataIndex: 'state', // 使用 state 字段展示进度
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
            // 使用 userId (number) 进行跳转
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgba(253, 178, 2, 1)',
        },
      }}
    >
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
              { value: '全部', label: '全部方向' },
              { value: '前端', label: '前端' },
              { value: '后端', label: '后端' },
            ]}
          />
          <Select
            value={progress}
            style={{ width: 160 }}
            onChange={setProgress}
            // 注意：这里的筛选项需要与后端 User 的 state 字段可能的值对应
            options={[
              { value: '全部', label: '全部进度' },
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
              setPage(1); // 重置时回到第一页
            }}
          >
            重置
          </Button>
        </Space>
        <Table
          rowKey="userId" // 使用 userId 作为 key
          loading={loading}
          columns={columns as any}
          dataSource={filteredData} // 使用前端筛选后的数据
          pagination={false} // 禁用表格自带分页
          style={{ height: '60vh' }}
        />
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            // 注意：total 总数不准确，需要后端在 /applyList 接口中返回总条目数
            total={filteredData.length}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
