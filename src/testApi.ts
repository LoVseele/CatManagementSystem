// src/testApi.ts

import { getApplyListAPI } from './services';

export async function testUserListApi() {
  console.log('--- 开始测试 getApplyListAPI ---');

  try {
    // 你可以在这里修改参数来测试不同的情况
    const params = {
      pageNum: 1,
      pageSize: 99,
      direction: '',
      status: '',
    };

    console.log('发送的请求参数:', params);

    // 调用 API (注意：这里我们不依赖 slice，直接调用)
    const apiResponse = await getApplyListAPI(params);
    const response = apiResponse.data; // 手动处理响应

    console.log('【成功】后端返回的完整数据:', response);

    if (response.code !== 200) {
      console.error('业务错误:', response.message);
    } else {
      console.log('提取出的用户列表 (response.data.data):', response.data.data);
      console.log(
        '提取出的用户总数 (response.data.total):',
        response.data.total
      );
    }
  } catch (error) {
    console.error('【失败】请求捕获到错误:', error);
  } finally {
    console.log('--- 接口测试结束 ---');
  }
}
