import api from './request';
import type {
  User,
  AppointmentSlot,
  AdminLoginRequest,
  ApiResponse,
} from '../types'; //

/*
 * @name 管理员登录
 * @description 对应接口文档 "管理员登录"
 * @param data {AdminLoginRequest} 包含 username 和 password
 */
export const adminLoginAPI = (data: AdminLoginRequest) => {
  // 注意: 接口文档将参数定义在 requestBody 中，因此作为 post/get 的 data 发送
  return api.get<ApiResponse<{ user: User; token: string }>>(
    '/api/admin/login',
    { data }
  );
};

/*
 * @name 管理员获取报名列表
 * @description 对应接口文档 "管理员获取报名列表"
 * @param params {{ pageSize?: number; pageNum?: number }} 分页参数
 */
export const getApplyListAPI = (params: {
  pageSize?: number;
  pageNum?: number;
}) => {
  return api.get<ApiResponse<User[]>>('/api/admin/applyList', { params });
};

/*
 * @name 管理员提交评分
 * @description 对应接口文档 "管理员提交评分"
 * @param params {{ accessId: number; score: number; comment: string }}
 */
export const submitScoreAPI = (params: {
  accessId: number;
  score: number;
  comment: string;
}) => {
  return api.post<ApiResponse<object>>('/api/admin/apply/score', null, {
    params,
  });
};

/*
 * @name 新增预约时间
 * @description 对应接口文档 "新增预约时间"
 * @param params 包含预约时间的详细信息
 */
export const addAppointmentTimeAPI = (params: {
  accessType: string;
  direction: string;
  interviewNumber: number;
  appointmentDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}) => {
  return api.post<ApiResponse<object>>('/api/admin/addAppointmentTime', null, {
    params,
  });
};

/*
 * @name 按用户id获取用户信息
 * @description 对应接口文档 "按用户id获取用户信息"
 * @param params {{ openId: string }}
 */
export const getUserDataByIdAPI = (params: { openId: string }) => {
  return api.get<ApiResponse<User>>('/api/admin/getDataById', { params });
};

/*
 * @name 获取预约时间
 * @description 对应接口文档 "获取预约时间" (管理员视角)
 */
export const getAdminAppointmentsTimeAPI = () => {
  return api.get<ApiResponse<AppointmentSlot[]>>(
    '/api/admin/getAppointmentsTime'
  );
};

/*
 * @name 设置招新状态
 * @description 对应接口文档 "设置招新状态"
 * @param params {{ status: string }}
 */
export const setRecruitStatusAPI = (params: { status: string }) => {
  return api.post<ApiResponse<object>>('/api/admin/setRecruitStatus', null, {
    params,
  });
};

/*
 * @name 用户预约时间获取
 * @description 对应接口文档 "用户预约时间获取" (管理员视角)
 */
export const getUserAppointmentTimeAPI = () => {
  return api.get<ApiResponse<any>>('/api/admin/getUserAppointmentTime');
};
