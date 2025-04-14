# BE_Kotlin - Backend API

Backend API cho ứng dụng thương mại điện tử xây dựng bằng Node.js, Express và MongoDB.

## Cài đặt

```bash
# Di chuyển vào thư mục dự án
cd BE_Kotlin

# Cài đặt dependencies
npm install

# Chạy ứng dụng trong môi trường production
npm run start

# Dừng server
Ctrl + C

# Chạy ứng dụng trong môi trường development (với nodemon)
npm run dev
```

## Cấu hình môi trường

Tạo file `.env` trong thư mục gốc của dự án với các biến môi trường sau:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

## API Endpoints

### Authentication

- `POST /api/accounts/register` - Đăng ký tài khoản mới
- `POST /api/accounts/login` - Đăng nhập
- `GET /api/accounts/me` - Lấy thông tin tài khoản hiện tại
- `PUT /api/accounts/change-password` - Đổi mật khẩu

### Accounts

- `GET /api/accounts` - Lấy danh sách tài khoản (Admin only)
- `GET /api/accounts/:email` - Lấy thông tin tài khoản theo email
- `PUT /api/accounts/:email` - Cập nhật thông tin tài khoản
- `DELETE /api/accounts/:email` - Xóa tài khoản (Admin only)

### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy thông tin sản phẩm theo ID
- `GET /api/products/category/:cateId` - Lấy danh sách sản phẩm theo danh mục
- `POST /api/products` - Tạo sản phẩm mới (Admin only)
- `PUT /api/products/:id` - Cập nhật thông tin sản phẩm (Admin only)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin only)

### Categories

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy thông tin danh mục theo ID
- `POST /api/categories` - Tạo danh mục mới (Admin only)
- `PUT /api/categories/:id` - Cập nhật thông tin danh mục (Admin only)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin only)

### Carts

- `GET /api/carts/:email` - Lấy giỏ hàng theo email
- `POST /api/carts` - Tạo giỏ hàng mới

### Cart Items

- `GET /api/cart-items/:cartId` - Lấy danh sách mục trong giỏ hàng
- `GET /api/cart-items/:cartId/:productId` - Lấy thông tin mục trong giỏ hàng
- `POST /api/cart-items` - Thêm mục vào giỏ hàng
- `PUT /api/cart-items/:cartId/:productId` - Cập nhật số lượng mục trong giỏ hàng
- `DELETE /api/cart-items/:cartId/:productId` - Xóa mục khỏi giỏ hàng

### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng (Admin only)
- `GET /api/orders/:id` - Lấy thông tin đơn hàng theo ID
- `GET /api/orders/email/:email` - Lấy danh sách đơn hàng theo email
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (Admin only)
- `DELETE /api/orders/:id` - Xóa đơn hàng (Admin only)

### Order Items

- `GET /api/order-items/:orderId` - Lấy danh sách mục trong đơn hàng
- `GET /api/order-items/:orderId/:productId` - Lấy thông tin mục trong đơn hàng
- `POST /api/order-items` - Thêm mục vào đơn hàng
- `PUT /api/order-items/:orderId/:productId` - Cập nhật thông tin mục trong đơn hàng
- `DELETE /api/order-items/:orderId/:productId` - Xóa mục khỏi đơn hàng

### Addresses

- `GET /api/addresses/:email` - Lấy danh sách địa chỉ theo email
- `GET /api/addresses/:id` - Lấy thông tin địa chỉ theo ID
- `POST /api/addresses` - Tạo địa chỉ mới
- `PUT /api/addresses/:id` - Cập nhật thông tin địa chỉ
- `DELETE /api/addresses/:id` - Xóa địa chỉ

### Payment Methods

- `GET /api/payment-methods` - Lấy danh sách phương thức thanh toán
- `GET /api/payment-methods/:id` - Lấy thông tin phương thức thanh toán theo ID
- `POST /api/payment-methods` - Tạo phương thức thanh toán mới (Admin only)
- `PUT /api/payment-methods/:id` - Cập nhật thông tin phương thức thanh toán (Admin only)
- `DELETE /api/payment-methods/:id` - Xóa phương thức thanh toán (Admin only)

## Công nghệ sử dụng

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- helmet
- cors
- dotenv

## Tác giả

- **Khanh Vo** - [khanhvo908](https://github.com/khanhvo908)