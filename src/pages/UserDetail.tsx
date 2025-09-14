// lovseele/catmanagementsystem/CatManagementSystem-feat/src/pages/UserDetail.tsx

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  ConfigProvider,
  // Select, // 暂时禁用
} from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUserById } from '../slices/usersSlice';
// import { fetchScoresByUser, addScore, editScore, deleteScore } from '../slices/scoresSlice'; // 暂时禁用

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 从 users slice 中获取当前用户信息和加载状态
  const { current: currentUser, loading: userLoading } = useAppSelector(
    (s) => s.users
  );

  // 从 auth slice 中获取认证信息，未来可能用于权限判断
  // const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    // 1. 检查 URL 中是否有 id
    if (id) {
      // 2. 将 URL 中的 id (字符串) 转换为数字
      const userId = parseInt(id, 10);
      // 3. 确保转换成功后，派发 action 获取用户数据
      if (!isNaN(userId)) {
        dispatch(fetchUserById(userId));
      }

      // 4. 【已注释】暂时不获取评分信息
      // dispatch(fetchScoresByUser(id));
    }
  }, [id, dispatch]);

  // 5. 【已注释】更新用户进度的功能，因后端暂无接口而禁用
  /*
  const handleProgressChange = async (value: string) => {
    if (!currentUser) return;
    // ... 调用 updateUserProgress 的逻辑 ...
  };
  */

  // 页面加载中，显示 loading 状态
  if (userLoading) {
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
              {/* 6. 使用从 store 获取的 currentUser 数据，并匹配正确的字段名 */}
              <Descriptions.Item label="姓名">
                {currentUser.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {currentUser.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Open ID">
                {currentUser.openId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学号">
                {currentUser.userNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学院专业班级">
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
                <Tag>{currentUser.state || '未开始'}</Tag>
                {/* 【功能禁用】因后端无接口，禁用此下拉框 */}
                {/* <Select defaultValue={currentUser.state} style={{ width: 160, marginLeft: 12 }} onChange={handleProgressChange} disabled>
                  <Option value="一轮考核">一轮考核</Option>
                  <Option value="二轮考核">二轮考核</Option>
                  <Option value="面试">面试</Option>
                  <Option value="未通过">未通过</Option>
                </Select> 
                */}
              </Descriptions.Item>
              <Descriptions.Item label="个人简介">
                {currentUser.userIntro || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                手机：{currentUser.phoneNumber || '-'} <br />
                邮箱：{currentUser.email || '-'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            // 如果加载完成但没有数据，显示提示信息
            !userLoading && <p>未找到该用户的信息。</p>
          )}
        </Card>

        {/* 7. 【已注释】将所有与评分相关的 Card 全部注释掉 */}
        {/*
        <Card title="评分记录" style={{ marginTop: 20 }}>
          // ... 评分列表 ...
        </Card>

        <Card title="添加评分" style={{ marginTop: 20 }}>
          // ... 添加评分表单 ...
        </Card>

        <Modal title="编辑评分">
          // ... 编辑评分模态框 ...
        </Modal>
        */}
      </ConfigProvider>
    </div>
  );
}
