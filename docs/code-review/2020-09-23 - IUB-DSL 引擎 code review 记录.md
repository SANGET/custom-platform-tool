# 2020-09-23 - IUB-DSL 引擎 code review 记录

---

## 资源

- 提交记录：https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend/merge_requests/81/diffs
- 提交者：蒋国才
- code review 主持：张相杰
- 提交内容：IUB-DSL 引擎
- 日期：2020-09-23

---

## 问题记录

| 问题 | 解决方案 | 提出者 | 备注 |
|---|---|---|---|
| IUB-DSL/types 文件夹命名含义不明确 | 将 IUB-DSL/types 改为 IUB-DSL/definition，明确目录为数据结构定义 | 张相杰 | - |
| IUB-DSL/definition 文件夹应该是明确的，只描述 IUB-DSL 数据结构本身，但包含了 engine 名词，容易混淆 | 将有 engine 的目录名重命名，去除 engine | 张相杰 | - |
| IUB-DSL/apb-dsl 文件夹不应该在 iub-dsl 目录下 | 后续更新将该目录移到适合的地方 | 张相杰 | - |
| 其他，见 gitlab 中的评论 | 张相杰 | - |
