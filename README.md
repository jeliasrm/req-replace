# req-replace

一个基于 Node.js 的网络代理服务，支持请求体字符串替换和流式响应转发。

## 功能特性

- ✅ 转发所有 HTTP/HTTPS 请求到目标服务器
- ✅ 支持请求体字符串查找替换
- ✅ 支持流式响应（SSE）转发
- ✅ 保持原始请求头和响应头
- ✅ 灵活的配置文件管理
- ✅ 无需安装额外依赖

## 安装

本程序仅使用 Node.js 内置模块，无需安装任何依赖包。

**环境要求：**
- Node.js >= 12.0.0

**克隆或下载项目后即可直接运行**

## 快速开始

```bash
# 进入项目目录
cd req-replace

# 启动服务
node server.js
```

启动成功后会显示：
```
===========================================
Proxy Server Running
Listening on: http://127.0.0.1:3030
Forwarding to: http://127.0.0.1:3000
Replace rules: 1 rule(s) loaded
===========================================
```

## 配置说明

### 1. rr-config.json

服务器基础配置文件：

```json
{
  "port": 3030,
  "base_url": "http://127.0.0.1:3000"
}
```

**配置项说明：**
- `port`: 代理服务监听的端口号（默认：3030）
- `base_url`: 转发目标服务器地址（默认：http://127.0.0.1:3000）

### 2. req-replace.json

请求体字符串替换规则配置：

```json
{
  "old_string_1": "new_string_1",
  "old_string_2": "new_string_2",
  "search_text": "replace_text"
}
```

**工作原理：**
- 每个键值对定义一条替换规则
- 程序会在请求体中查找所有的 `key`，并替换为对应的 `value`
- 支持多条规则，按照定义顺序依次执行
- 替换完成后，将新的请求体转发到目标服务器

**使用场景示例：**
- 替换 API 密钥或令牌
- 修改请求参数值
- 动态替换环境相关的配置

## 使用示例

### 场景 1：基本转发

**配置：**
```json
// rr-config.json
{
  "port": 3030,
  "base_url": "http://127.0.0.1:3000"
}

// req-replace.json
{}
```

客户端请求：`http://127.0.0.1:3030/api/users`  
转发到：`http://127.0.0.1:3000/api/users`

### 场景 2：替换 API 密钥

**配置：**
```json
// req-replace.json
{
  "PLACEHOLDER_KEY": "YOUR_ACTUAL_API_KEY"
}
```

客户端发送请求体：
```json
{
  "apiKey": "PLACEHOLDER_KEY",
  "data": "test"
}
```

转发后的请求体：
```json
{
  "apiKey": "YOUR_ACTUAL_API_KEY",
  "data": "test"
}
```

### 场景 3：多规则替换

**配置：**
```json
// req-replace.json
{
  "dev_server": "prod_server",
  "test_db": "production_db",
  "debug": "info"
}
```

所有匹配的字符串都会被替换后再转发。

## 转发规则

程序会完整保留请求的路径和查询参数：

| 客户端请求 | 转发到 (base_url: http://127.0.0.1:3000) |
|-----------|----------------------------------------|
| `http://127.0.0.1:3030/api/test` | `http://127.0.0.1:3000/api/test` |
| `http://127.0.0.1:3030/users?id=1` | `http://127.0.0.1:3000/users?id=1` |
| `http://127.0.0.1:3030/v1/data` | `http://127.0.0.1:3000/v1/data` |

## 日志

服务器会输出以下日志信息：

```
[2024-01-10T10:30:45.123Z] POST /api/chat
[Replaced] Request body processed with 2 rule(s)
[Response] 200 /api/chat
```

## 注意事项

1. **流式响应支持**：程序使用 `pipe` 方法转发响应，完整支持 SSE (Server-Sent Events) 等流式传输
2. **请求头转发**：所有原始请求头都会被保留并转发（除了 `host` 会被更新为目标服务器）
3. **错误处理**：如果目标服务器不可达，会返回 502 错误
4. **性能**：字符串替换使用 `split().join()` 方法，适合大多数场景

## 故障排查

**问题：启动失败，提示端口被占用**
```
Error: listen EADDRINUSE: address already in use :::3030
```
解决方法：修改 `rr-config.json` 中的 `port` 为其他未使用的端口。

**问题：无法连接到目标服务器**
```
Proxy Error: connect ECONNREFUSED 127.0.0.1:3000
```
解决方法：确认 `rr-config.json` 中的 `base_url` 配置正确，且目标服务器正在运行。

## 许可证

MIT License
