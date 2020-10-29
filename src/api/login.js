import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return Promise.resolve({
    'user': {
      'createBy': null,
      'updatedBy': 'admin',
      'createTime': 1534986716000,
      'updateTime': 1599273811000,
      'id': 1,
      'roles': [{ 'id': 1, 'name': '超级管理员', 'level': 1, 'dataScope': '全部' }],
      'jobs': [{ 'id': 11, 'name': '全栈开发' }],
      'dept': { 'id': 2, 'name': '研发部' },
      'deptId': null,
      'username': 'admin',
      'nickName': '管理员',
      'email': 'admin@el-admin.vip',
      'phone': '18888888888',
      'gender': '男',
      'avatarName': 'avatar.jpeg',
      'avatarPath': '/home/eladmin/avatar/avatar.jpeg',
      'enabled': true,
      'pwdResetTime': 1588495111000
    }, 'dataScopes': [], 'roles': ['admin']
  })
  /* request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })*/
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}
