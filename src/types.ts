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
  name: string | null;
  userNumber: string | null;
  academy: string | null;
  phoneNumber: string | null;
  email: string | null;
  userIntro: string | null;
  direction: string | null;
  state: string | null;
  role: string;
  username: string;
}

// 预约信息类型
export interface Appointment {
  id?: number;
  openId: string;
  interviewDate: string;
  interviewStartTime: string;
  interviewEndTime: string;
  direction: string;
  type?: string;
}

// 预约时间段类型 (
export interface AppointmentSlot {
  id?: number;
  accessType: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  appointedCount?: number;
  direction: string;
}

//提交用户分数请求体类型
export interface SubmitScoreParams {
  accessId: number;
  score: number;
  comment: string;
}

// 评分信息类型
export interface Score {
  id?: number;
  userId: string;
  round: string;
  score: number;
  comment?: string;
  adminName: string;
}

// 考核信息类型
export interface AssessmentInfo {
  accessId: number;
  studentDTO: User;
  accessType: string;
  direction: string;
  appointmentSlotID: number;
  state: number;
  scoreCommentList: Score[];
  createTime: string;
  updateTime: string;
}

// 管理员登录请求体类型
export interface AdminLoginParams {
  userName: string;
  password?: string;
}

// 管理员登录返回数据类型
export interface LoginResponseData {
  user: User;
  token: string;
  refreshToken: string;
}

// 获取用户列表的 thunk
export interface FetchUsersPayload {
  list: User[];
  total: number;
}

//获取用户列表请求体类型
export interface FetchUsersParams {
  pageNum: number;
  pageSize: number;
  status: string;
  direction: string;
}
