// 引入的同时再次导出
export { default as category } from './product/category.js'
export { default as trademark } from './product/trademark.js'
export { default as attr } from './product/attr.js'
export { default as spu } from './product/spu.js'
export { default as sku } from './product/sku.js'


// 权限相关
export * as user from './acl/user'
export { default as role } from './acl/role'
export { default as permission } from './acl/permission'