import api from './api'; // 导入配置好的 axios 实例
import type {
  User,
  AppointmentSlot,
  AdminLoginRequest,
  LoginResponseData,
  ApiResponse,
} from '../types';

/*
 * @name 管理员登录
 * @description 对应接口文档 "管理员登录"。
 * @param data {AdminLoginRequest} 包含 userName 和 password 的请求体。
 * @returns {Promise<ApiResponse<User>>} 返回一个包含 User 对象的响应，User 对象内部含有 token。
 */

export const adminLoginAPI = (data: AdminLoginRequest) => {
  // 【正确类型标注】我们期望返回的 data 是 LoginResponseData 类型
  return api.post<ApiResponse<LoginResponseData>>('/api/admin/login', data);
};

/*
 * @name 管理员获取报名列表
 * @description 对应接口文档 "管理员获取报名列表"。
 * @param params {{ pageSize?: number; pageNum?: number }} 分页参数。
 * @returns {Promise<ApiResponse<User[]>>}
 */
export const getApplyListAPI = (params: {
  pageSize?: number;
  pageNum?: number;
}) => {
  return api.get<ApiResponse<User[]>>('/api/admin/applyList', { params });
};

/*
 * @name 管理员提交评分
 * @description 对应接口文档 "管理员提交评分"。
 * @param params {{ accessId: number; score: number; comment: string }}
 * @returns {Promise<ApiResponse<string>>}
 */
export const submitScoreAPI = (params: {
  accessId: number;
  score: number;
  comment: string;
}) => {
  return api.post<ApiResponse<string>>('/api/admin/apply/score', null, {
    params,
  });
};

/*
 * @name 新增预约时间
 * @description 对应接口文档 "新增预约时间"。
 * @param params 包含预约时间的详细信息。
 * @returns {Promise<ApiResponse<string>>}
 */
export const addAppointmentTimeAPI = (params: {
  accessType: string;
  direction: string;
  interviewNumber: number;
  appointmentDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}) => {
  return api.post<ApiResponse<string>>('/api/admin/addAppointmentTime', null, {
    params,
  });
};

/*
 * @name 获取用户信息
 * @description 对应接口文档 "获取用户信息"。
 * @param params {{ userId: number }}
 * @returns {Promise<ApiResponse<User>>}
 */
export const getUserInfoAPI = (params: { userId: number }) => {
  return api.get<ApiResponse<User>>('/api/admin/getUserInfo', { params });
};

/*
 * @name 获取预约时间列表
 * @description 对应接口文档 "获取预约时间"。
 * @returns {Promise<ApiResponse<AppointmentSlot[]>>}
 */
export const getAppointmentTimeListAPI = () => {
  return api.get<ApiResponse<AppointmentSlot[]>>(
    '/api/admin/appointmentTimeList'
  );
};

/*
 * @name 设置招新状态
 * @description 对应接口文档 "设置招新状态"。
 * @param params {{ status: string }}
 * @returns {Promise<ApiResponse<string>>}
 */
export const setRecruitStatusAPI = (params: { status: string }) => {
  return api.post<ApiResponse<string>>('/api/admin/setRecruitStatus', null, {
    params,
  });
};
