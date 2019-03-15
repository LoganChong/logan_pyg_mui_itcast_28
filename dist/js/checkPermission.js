"use strict";

// 验证权限
checkPermission();

function checkPermission() {
  // 需要放在放在结构加载之前执行，防止先显示购物车后执行验证权限js
  // 拿到用户凭据
  var userinfoStr = sessionStorage.getItem('userinfo'); // 判断是否有用户凭据

  if (!userinfoStr) {
    // 先存一下当前页面
    sessionStorage.setItem('pageurl', location.href);
    location.href = 'login.html';
    return;
  }
}
//# sourceMappingURL=checkPermission.js.map
