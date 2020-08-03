/*
 * @Author: your name
 * @Date: 2020-07-25 10:15:08
 * @LastEditTime: 2020-07-27 17:23:04
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\pages\template\template.ts
 */
function foo(firstName: string, lastName?: string) {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

export { foo };
