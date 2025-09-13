// lovseele/catmanagementsystem/CatManagementSystem-feat/src/types.ts

// 用户信息类型
export interface User {
  userId: string;
  openId: string;
  code: string;
  name: string;
  userNumber: string;
  academy: string;
  phoneNumber: string;
  email: string;
  userIntro: string;
  direction: string;
  state: string;
  username: string;
  token: string;
}

// 用户预约信息类型
export interface Appointment {
  id?: number;
  openId: string;
  interviewDate: string; // yyyy-MM-dd
  interviewStartTime: string;
  interviewEndTime: string;
  direction: string; // "前端" | "后端"
  type?: string; // 可选： "面试" | "一轮考核" | "二轮考核"
}

// 预约时间段类型
export interface AppointmentSlot {
  id?: number;
  interviewDate: string;
  interviewStartTime: string;
  interviewEndTime: string;
  interviewNumber: number; // 预约人数上限
  interviewCurrentNumber: number; // 当前预约人数
  direction: string;
}

// 评分信息类型
export interface Score {
  id?: number;
  userId: string; // 对应 User 的 openId
  round: string;
  score: number;
  comment?: string;
  adminName: string;
}

// 管理员登录请求体类型
export interface AdminLoginRequest {
  userName: string;
  password?: string;
}

// 统一的 API 响应体类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
