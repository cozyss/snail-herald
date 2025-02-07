"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "zh";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

export const translations: Translations = {
  en: {
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    submit: "Submit",
    logout: "Logout",
    errorOccurred: "An error occurred",
    invalidCredentials: "Invalid credentials",
    usernameTaken: "Username is already taken",
    registrationSuccess: "Registration successful",
    loginSuccess: "Login successful",
    letterPileWithUsername: "Letter Pile - {username}",
    sendLetter: "Send Letter",
    letterInbox: "Letter Inbox",
    letterOutbox: "Letter Outbox",
    loadingLetters: "Loading letters...",
    errorLoadingLetters: "Error loading letters",
    noReceivedLetters: "No received letters yet",
    noSentLetters: "No sent letters yet",
    to: "To",
    from: "From",
    announcement: "Announcement",
    openLetter: "Open this letter...",
    sentAt: "Sent at",
    delete: "Delete",
    deleting: "Deleting...",
    save: "Save",
    cancel: "Cancel",
    closeLetter: "Close Letter",
    letterDeletedSuccess: "Letter deleted successfully",
    confirmDeleteLetter: "Are you sure you want to delete this letter?",
    selectRecipient: "Select recipient",
    writeMessage: "Write your message",
    sending: "Sending...",
    letterSentSuccess: "Letter sent successfully",
    currentDelayRange: "Current delay range:",
    hours: "hours",
    minutes: "minutes",
    remainingActions: "Remaining actions today:",
    unlimited: "∞",
    featureRequests: "Feature Requests",
    createFeatureRequest: "Create Feature Request",
    describeFeature: "Describe the feature",
    creating: "Creating...",
    featureCreatedSuccess: "Feature request created successfully",
    noFeatureRequests: "No feature requests yet",
    confirmDeleteFeature: "Are you sure you want to delete this feature request?",
    featureDeletedSuccess: "Feature request deleted successfully",
    writeAnnouncement: "Write your announcement",
    sendAnnouncement: "Send Announcement",
    announcementSentSuccess: "Announcement sent successfully",
    welcomeLetterEditor: "Welcome Letter Editor",
    lastModified: "Last modified:",
    characters: "characters",
    edit: "Edit",
    userStats: "User Statistics",
    messageCount: "Message Count",
    createdAt: "Created At",
    role: "Role",
    admin: "Admin",
    user: "User",
    securityAnswer: "Security Answer",
    incomingLetters: "Incoming Letters",
    lettersOnTheWay: "Letters are on their way to you...",
  },
  zh: {
    login: "登录",
    register: "注册",
    username: "用户名",
    password: "密码",
    submit: "提交",
    logout: "登出",
    errorOccurred: "发生错误",
    invalidCredentials: "无效的凭据",
    usernameTaken: "用户名已被使用",
    registrationSuccess: "注册成功",
    loginSuccess: "登录成功",
    letterPileWithUsername: "信件堆 - {username}",
    sendLetter: "发送信件",
    letterInbox: "收件箱",
    letterOutbox: "发件箱",
    loadingLetters: "加载信件中...",
    errorLoadingLetters: "加载信件时出错",
    noReceivedLetters: "暂无收到的信件",
    noSentLetters: "暂无发送的信件",
    to: "收件人",
    from: "发件人",
    announcement: "公告",
    openLetter: "打开这封信...",
    sentAt: "发送于",
    delete: "删除",
    deleting: "删除中...",
    save: "保存",
    cancel: "取消",
    closeLetter: "关闭信件",
    letterDeletedSuccess: "信件删除成功",
    confirmDeleteLetter: "确定要删除这封信吗？",
    selectRecipient: "选择收件人",
    writeMessage: "写下你的信息",
    sending: "发送中...",
    letterSentSuccess: "信件发送成功",
    currentDelayRange: "当前延迟范围：",
    hours: "小时",
    minutes: "分钟",
    remainingActions: "今日剩余操作次数：",
    unlimited: "∞",
    featureRequests: "功能请求",
    createFeatureRequest: "创建功能请求",
    describeFeature: "描述功能",
    creating: "创建中...",
    featureCreatedSuccess: "功能请求创建成功",
    noFeatureRequests: "暂无功能请求",
    confirmDeleteFeature: "确定要删除这个功能请求吗？",
    featureDeletedSuccess: "功能请求删除成功",
    writeAnnouncement: "写下你的公告",
    sendAnnouncement: "发送公告",
    announcementSentSuccess: "公告发送成功",
    welcomeLetterEditor: "欢迎信编辑器",
    lastModified: "最后修改：",
    characters: "字符",
    edit: "编辑",
    userStats: "用户统计",
    messageCount: "消息数量",
    createdAt: "创建于",
    role: "角色",
    admin: "管理员",
    user: "用户",
    securityAnswer: "安全问题答案",
    incomingLetters: "即将到达的信件",
    lettersOnTheWay: "信件正在向您飞来...",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let translation = translations[language][key] || key;

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value));
        });
      }

      return translation;
    },
    [language]
  );

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
