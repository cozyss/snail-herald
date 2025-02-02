"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export type Language = "en" | "zh";

type Translations = {
  [key in Language]: {
    // Navigation
    home: string;
    dashboard: string;
    welcome: string;
    login: string;
    register: string;
    logout: string;

    // Home page
    letterPileWithUsername: string;
    sendLetter: string;
    loadingLetters: string;
    errorLoadingLetters: string;
    letterInbox: string;
    letterOutbox: string;
    noReceivedLetters: string;
    noSentLetters: string;

    // Login/Register
    slogan: string;
    username: string;
    password: string;
    usernameRequired: string;
    passwordRequired: string;
    usernameLengthError: string;
    passwordLengthError: string;
    signingIn: string;
    signIn: string;
    registering: string;

    // Letters and Messages
    to: string;
    from: string;
    announcement: string;
    sentAt: string;
    closeLetter: string;
    typeLetterHere: string;
    cancel: string;
    sending: string;
    send: string;
    letterContent: string;
    enterUsername: string;
    openLetter: string;

    // Admin
    sendAnnouncement: string;
    currentDelayRange: string;
    loading: string;
    errorLoadingSettings: string;
    hours: string;
    update: string;
    letterDelaySettings: string;
    minDelay: string;
    maxDelay: string;
    saveChanges: string;
    updating: string;
    userStatistics: string;
    lettersSent: string;
    createdAt: string;
    role: string;
    admin: string;
    user: string;

    // Success/Error messages
    loginSuccess: string;
    registerSuccess: string;
    letterSentSuccess: string;
    announcementSentSuccess: string;
    settingsUpdatedSuccess: string;
    errorOccurred: string;
    usernameNotFound: string;
    incorrectPassword: string;
    usernameTaken: string;
  };
};

export const translations: Translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    welcome: "Welcome",
    login: "Login",
    register: "Register",
    logout: "Logout",

    // Home page
    letterPileWithUsername: "📮 {username}'s Pile of Letters",
    sendLetter: "Send a Letter",
    loadingLetters: "Loading letters...",
    errorLoadingLetters: "Error loading letters",
    letterInbox: "📨 Letter Inbox",
    letterOutbox: "📫 Letter Outbox",
    noReceivedLetters: "No received letters",
    noSentLetters: "No sent letters",

    // Login/Register
    slogan: "Slow messages, more love",
    username: "Username",
    password: "Password",
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
    usernameLengthError: "Username must be at least 3 characters",
    passwordLengthError: "Password must be at least 6 characters",
    signingIn: "Signing in...",
    signIn: "Sign in",
    registering: "Registering...",

    // Letters and Messages
    to: "To:",
    from: "From:",
    announcement: "Announcement",
    sentAt: "Sent at:",
    closeLetter: "Close Letter",
    typeLetterHere: "Type your letter here...",
    cancel: "Cancel",
    sending: "Sending...",
    send: "Send",
    letterContent: "Letter content is required",
    enterUsername: "Enter username",
    openLetter: "Open Letter",

    // Admin
    sendAnnouncement: "Send an Announcement",
    currentDelayRange: "Current Delay Range:",
    loading: "Loading...",
    errorLoadingSettings: "Error loading settings",
    hours: "hours",
    update: "Update",
    letterDelaySettings: "Letter Delay Settings",
    minDelay: "Minimum Delay (hours)",
    maxDelay: "Maximum Delay (hours)",
    saveChanges: "Save Changes",
    updating: "Updating...",
    userStatistics: "User Statistics",
    lettersSent: "Letters Sent",
    createdAt: "Created At",
    role: "Role",
    admin: "Admin",
    user: "User",

    // Success/Error messages
    loginSuccess: "Login successful!",
    registerSuccess: "Registration successful! Please log in.",
    letterSentSuccess: "Letter sent successfully!",
    announcementSentSuccess: "Announcement sent successfully!",
    settingsUpdatedSuccess: "Delay settings updated successfully!",
    errorOccurred: "An error occurred",
    usernameNotFound: "Username not found",
    incorrectPassword: "Incorrect password",
    usernameTaken: "Username already taken",
  },
  zh: {
    // Navigation
    home: "主页",
    dashboard: "仪表板",
    welcome: "欢迎",
    login: "登录",
    register: "注册",
    logout: "退出",

    // Home page
    letterPileWithUsername: "📮 {username}的信件堆",
    sendLetter: "发送信件",
    loadingLetters: "加载信件中...",
    errorLoadingLetters: "加载信件出错",
    letterInbox: "📨 收件箱",
    letterOutbox: "📫 发件箱",
    noReceivedLetters: "没有收到的信件",
    noSentLetters: "没有发送的信件",

    // Login/Register
    slogan: "车马很快，邮件还是可以很慢",
    username: "用户名",
    password: "密码",
    usernameRequired: "请输入用户名",
    passwordRequired: "请输入密码",
    usernameLengthError: "用户名至少需要3个字符",
    passwordLengthError: "密码至少需要6个字符",
    signingIn: "登录中...",
    signIn: "登录",
    registering: "注册中...",

    // Letters and Messages
    to: "收件人：",
    from: "发件人：",
    announcement: "公告",
    sentAt: "发送时间：",
    closeLetter: "关闭信件",
    typeLetterHere: "在此输入您的信件...",
    cancel: "取消",
    sending: "发送中...",
    send: "发送",
    letterContent: "信件内容不能为空",
    enterUsername: "输入用户名",
    openLetter: "打开信件",

    // Admin
    sendAnnouncement: "发送公告",
    currentDelayRange: "当前延迟范围：",
    loading: "加载中...",
    errorLoadingSettings: "加载设置出错",
    hours: "小时",
    update: "更新",
    letterDelaySettings: "信件延迟设置",
    minDelay: "最小延迟（小时）",
    maxDelay: "最大延迟（小时）",
    saveChanges: "保存更改",
    updating: "更新中...",
    userStatistics: "用户统计",
    lettersSent: "已发送信件",
    createdAt: "创建时间",
    role: "角色",
    admin: "管理员",
    user: "用户",

    // Success/Error messages
    loginSuccess: "登录成功！",
    registerSuccess: "注册成功！请登录。",
    letterSentSuccess: "信件发送成功！",
    announcementSentSuccess: "公告发送成功！",
    settingsUpdatedSuccess: "延迟设置更新成功！",
    errorOccurred: "发生错误",
    usernameNotFound: "用户名不存在",
    incorrectPassword: "密码错误",
    usernameTaken: "用户名已被使用",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [cookies, setCookie] = useCookies<"language", { language?: Language }>([
    "language",
  ]);
  const [language, setLanguageState] = useState<Language>(
    cookies.language || "en",
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie("language", lang, {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });
  };

  useEffect(() => {
    if (!cookies.language) {
      setCookie("language", "en", {
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
    }
  }, [cookies.language, setCookie]);

  const t = (key: keyof typeof translations.en, params?: Record<string, string>) => {
    let text = translations[language][key];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
