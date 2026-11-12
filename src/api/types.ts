/** 后端统一响应体 */
export interface ApiEnvelope<T> {  // 泛型接口
  code: number // 业务状态码
  message: string // 提示信息
  data: T // 真正的业务数据
}

/** MyBatis-Plus 分页对象 */
export interface MpPage<T> { // 泛型分页结构
  records: T[]  // 当前页记录数组（MyBatis-Plus固定叫records）
  total: number // 总记录数
  size: number // 每页条数
  current: number // 当前页码（MyBatis-Plus固定叫current，不是page）
  pages?: number // 总页数
}

/** 通用分页结构（统一给表格组件用） */
export interface PageData<T> { 
  list: T[]  // 记录数组
  total: number // 总记录数
  page: number // 当前页码
  size: number // 每页条数
}

export interface Admin { // 管理员实体
  aid?: number // 管理员主键，可选：新增时还没有id，所以用?
  username: string // 用户名，必填
  password?: string // 密码，选填：查询时不返回，新增/修改时才传
  roles?: Role[] // 该管理员拥有的角色列表，可选（详情接口才带）
}

export interface Role { // 角色实体
  rid?: number // 角色主键，可选（新增时没有）
  roleName: string // 角色名称，必填
  permissions?: Permission[] // 该角色拥有的权限列表，可选（详情接口才带）
}

export interface Permission { // 权限实体
  pid?: number // 权限主键，可选
  permissionName: string // 权限名称，必填
  url: string // 权限对应的资源路径/标识，必填（如faq/search）
}

export interface Brand { // 品牌实体
  id?: number // 主键，可选
  name: string // 品牌名称，必填
  logo?: string // 品牌logo图片地址，可选
}

export interface ProductType { // 商品实体类（支持多级，如一级/二级/三级分类）
  id?: number // 主键，可选
  name: string // 分类名称，必填
  parentId?: number // 父分类id；为空表示顶级分类
  status?: number // 状态（如1启用/0禁用），可选
}

export interface SpecificationOption { // 规格实体类
  id?: number // 主键，可选
  specificationId?: number // 所属规格id
  optionName: string // 选项名称，必填
  orders?: number // 排序序号，选填（控制选项在页面上的展示顺序）
}

export interface Specification { // 规格实体
  id?: number // 主键，可选
  specName: string // 规格名称，必填
  productTypeId?: number // 所属商品分类id
  specificationOptions?: SpecificationOption[] // 该规格下的选项列表，可选（详情才带）
}

export interface GoodsImage { // 商品图片实体
  id?: number // 主键，可选
  goodsId?: number // 所属商品id
  imageTitle?: string // 图片标题/说明，可选
  imageUrl: string // 图片地址，必填
}

export interface Goods { // 商品实体
  id?: number // 主键，可选
  goodsName: string // 商品名称，必填
  caption?: string // 副标题，可选
  price?: number // 价格，可选
  brandId?: number // 品牌id，可选
  brand?: Brand // 关联的品牌对象（详情接口才带），可选
  productType1Id?: number // 一级分类id，可选
  productType2Id?: number // 二级分类id，可选
  productType3Id?: number // 三级分类id，可选
  headerPic?: string // 商品主图地址，可选
  images?: GoodsImage[] // 商品图片列表，可选
  isMarketable?: boolean // 是否上架，可选（true上架/false下架）
  introduction?: string // 商品详情介绍，可选
  specifications?: Specification[] // 商品关联的规格列表，可选
}

export interface SeckillGoods { // 秒杀商品实体
  id?: number // 秒杀记录主键，可选
  goodsId?: number // 关联的商品id，可选
  title: string // 秒杀活动标题，必填
  introduction?: string // 活动介绍，可选
  headerPic?: string // 活动头图，可选
  price?: number // 秒杀价，可选
  costPrice?: number // 原价，可选（用于展示划线价）
  startTime?: string // 活动开始时间，可选（字符串，通常是ISO时间格式）
  endTime?: string // 活动结束时间，可选
  num?: number // 秒杀数量/已售数量，可选
  stockCount?: number // 库存数量，可选
}

export interface Category { // 首页类目/频道实体
  id?: number // 主键，可选
  title: string // 类目名称，必填
  url?: string // 跳转链接，可选
  pic?: string // 类目图标/图片，可选
  status?: number // 状态，可选
}

/** 退款单 */
export interface Refund { // 退款单实体
  id: string // 退款单主键
  orderId: string // 关联订单id
  userId: number // 下单用户id
  refundNo: string // 退款单号（业务编号），必填
  transactionId?: string // 微信支付交易单号，可选
  wxRefundId?: string // 微信退款单号，可选
  amount: number // 退款金额，必填
  reason?: string // 退款原因，可选
  status: 0 | 1 | 2 | 3 | 4 // 退款状态，用联合字面量类型限制只能是这五个值之一
  orderStatusBefore?: number // 退款前的订单状态快照，可选（用于退款失败时回滚）
  auditBy?: string // 审批人，可选
  auditTime?: string // 审批时间，可选
  auditRemark?: string // 审批备注，可选
  createTime?: string // 申请创建时间，可选
  successTime?: string // 退款成功时间，可选
}

export interface Faq { // Faq实体
  id?: string // 主键，String类型，可选
  categoryId?: number // 所属分类id，可选
  question: string // 问题内容，必填
  answer: string // 答案内容，必填
  status?: number // 状态，可选
  useCount?: number // 被使用/查看次数，可选（用于统计热门问题）
}

export interface SensitiveWord { // 敏感词实体
  id?: number // 主键，可选
  word: string // 敏感词内容，必填
  type: 'deny' | 'allow' // 敏感词类型：deny=禁止词/allow=允许词，联合字面量限定
}