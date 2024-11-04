// 手机号正则表达式
export const phoneRegexStr = "^1[3-9]\\d{9}$";
export const phoneRegex = new RegExp(phoneRegexStr);

// 用户名正则表达式
export const usernameRegexStr = "^(?=.*[a-zA-Z])[a-zA-Z0-9_]{6,20}$";
export const usernameRegex = new RegExp(usernameRegexStr);

// 密码正则表达式
export const passwordRegexStr = "^[a-zA-Z0-9_!#$%&*+,-.:;<=>?@^]{6,32}$";
export const passwordRegex = new RegExp(passwordRegexStr);

// 昵称正则表达式
export const nicknameRegexStr = "^[\\p{L}\\p{N}\\p{M}\\p{P}\\p{S}]{6,64}$";
export const nicknameRegex = new RegExp(nicknameRegexStr, "u");

// 邮箱正则表达式
export const emailRegexStr = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
export const emailRegex = new RegExp(emailRegexStr);

// 性别正则表达式
export const genderRegexStr = "^[0-2]$";
export const genderRegex = new RegExp(genderRegexStr);
