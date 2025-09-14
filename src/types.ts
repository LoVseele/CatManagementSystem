// lovseele/catmanagementsystem/CatManagementSystem-feat/src/types.ts

// 统一的 API 响应体类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户信息类型 (根据后端真实数据修正)
export interface User {
  userId: number;
  openId: string | null;
  code: string | null;
  name: string | null; // 普通用户的真实姓名
  userNumber: string | null;
  academy: string | null;
  phoneNumber: string | null;
  email: string | null;
  userIntro: string | null;
  direction: string | null;
  state: string | null;
  role: string; // 'admin' 或 'user'
  username: string; // 管理员的登录名/显示名
}

// 预约信息类型 (基于旧 db.json，待后端提供接口后可能需要调整)
export interface Appointment {
  id?: number;
  openId: string;
  interviewDate: string; // yyyy-MM-dd
  interviewStartTime: string;
  interviewEndTime: string;
  direction: string;
  type?: string;
}

// 预约时间段类型 (与后端 /api/admin/appointmentTimeList 接口匹配)
export interface AppointmentSlot {
  id?: number;
  interviewDate: string;
  interviewStartTime: string;
  interviewEndTime: string;
  interviewNumber: number; // 预约人数上限
  interviewCurrentNumber: number; // 当前预约人数
  direction: string;
}

// 评分信息类型 (基于旧 db.json，待后端提供接口后可能需要调整)
export interface Score {
  id?: number;
  userId: string;
  round: string;
  score: number;
  comment?: string;
  adminName: string;
}

// 管理员登录请求体类型 (修正为 username)
export interface AdminLoginRequest {
  userName: string;
  password?: string;
}

// 【新增】管理员登录成功后，ApiResponse.data 的类型
export interface LoginResponseData {
  user: User;
  token: string;
  refreshToken: string;
}
