// lovseele/catmanagementsystem/CatManagementSystem-feat/src/services/index.ts

import api from './api'; // 确保导入的是配置好的 axiosInstance
import type {
  User,
  AppointmentSlot,
  AdminLoginParams,
  ApiResponse,
  LoginResponseData,
  FetchUsersParams,
  SubmitScoreParams,
  AssessmentInfo,
} from '../types';

// =================================================================
// ========================= CAT管理员接口 =========================
// =================================================================

/**
 * @name 管理员登录
 * @description POST /api/admin/login
 */
export const adminLoginAPI = (data: AdminLoginParams) => {
  return api.post<ApiResponse<LoginResponseData>>('/api/admin/login', data);
};

/**
 * @name 管理员获取报名列表
 * @description GET /api/admin/applyList
 */
export const getApplyListAPI = (params: FetchUsersParams) => {
  return api.get<ApiResponse<{ data: User[]; total: number }>>(
    '/api/admin/applyList',
    { params }
  );
};

/**
 * @name 管理员提交评分
 * @description POST /api/admin/apply/score
 */
export const submitScoreAPI = (params: SubmitScoreParams) => {
  return api.post<ApiResponse<string>>('/api/admin/apply/score', null, {
    params,
  });
};

/**
 * @name 新增预约时间
 * @description POST /api/admin/addAppointmentTime
 */
export const addAppointmentTimeAPI = (
  params: Omit<AppointmentSlot, 'id' | 'appointedCount' | 'capacity'> & {
    interviewNumber: number;
  }
) => {
  return api.post<ApiResponse<string>>('/api/admin/addAppointmentTime', null, {
    params,
  });
};

/**
 * @name 更改预约时间段
 * @description POST /api/admin/updateAppointmentSlot
 */
export const updateAppointmentSlotAPI = (data: AppointmentSlot) => {
  return api.post<ApiResponse<AppointmentSlot>>(
    '/api/admin/updateAppointmentSlot',
    data
  );
};

/**
 * @name 删除预约时间段
 * @description POST /api/admin/deleteAppointmentSlot
 */
export const deleteAppointmentSlotAPI = (params: {
  appointmentSlotId: number;
}) => {
  return api.post<ApiResponse<string>>(
    '/api/admin/deleteAppointmentSlot',
    null,
    {
      params,
    }
  );
};

/**
 * @name 管理员获取预约时间列表
 * @description GET /api/admin/appointmentTimeList
 */
export const getAppointmentTimeListAPI = () => {
  return api.get<ApiResponse<AppointmentSlot[]>>(
    '/api/admin/appointmentTimeList'
  );
};

/**
 * @name 获取用户信息
 * @description GET /api/admin/getUserInfo
 */
export const getUserInfoAPI = (params: { userId: number }) => {
  return api.get<ApiResponse<User>>('/api/admin/getUserInfo', { params });
};

/**
 * @name 设置招新状态
 * @description POST /api/admin/setRecruitStatus
 */
export const setRecruitStatusAPI = (params: { status: string }) => {
  return api.post<ApiResponse<string>>('/api/admin/setRecruitStatus', null, {
    params,
  });
};

/**
 * @name 更新用户状态
 * @description POST /api/admin/updateUserStatus
 */
export const updateUserStatusAPI = (data: {
  userId: number;
  status: string;
}) => {
  return api.post<ApiResponse<string>>('/api/admin/updateUserStatus', data);
};

/**
 * @name 获取用户的评分
 * @description GET /api/admin/getScore
 */
export const getAssessmentInfo = (params: { userId: number }) => {
  return api.get<ApiResponse<AssessmentInfo[]>>('/api/admin/getScore', {
    params,
  });
};

/**
 * @name 根据预约时间获取用户
 * @description GET /api/admin/getUsersByAppointmentTime
 */
export const getUsersByAppointmentTimeAPI = (params: {
  appointmentSlotId: number;
}) => {
  return api.get<ApiResponse<User[]>>('/api/admin/getUsersByAppointmentTime', {
    params,
  });
};
