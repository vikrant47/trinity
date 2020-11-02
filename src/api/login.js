import request from '@/utils/request';
import { TenantService } from '@/modules/engine/services/tenant.service';

export function login(username, password, code, uuid) {
  return TenantService.request({
    url: '/api/engine/auth/login',
    method: 'post',
    data: {
      password,
      code,
      uuid,
      login: username
    }
  });
}

export function getInfo() {
  return TenantService.instance.request({
    url: '/api/engine/auth/user',
    method: 'get'
  });
}

export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  });
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  });
}
