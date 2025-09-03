export interface Appointment {
  id?: number;
  openId: string;
  interviewDate: string; // yyyy-MM-dd
  interviewStartTime: string;
  interviewEndTime: string;
  direction: string; // "前端" | "后端"
  type?: string; // 可选： "面试" | "一轮考核" | "二轮考核"
}

export interface AppointmentSlot {
  id?: number;
  interviewDate: string;
  interviewStartTime: string;
  interviewEndTime: string;
  interviewNumber: number; // 预约人数上限
  interviewCurrentNumber: number; // 当前预约人数
  direction: string;
}
