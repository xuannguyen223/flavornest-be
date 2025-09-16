Start app guide:

- Cài Docker Desktop + Docker Compose (Nếu Mac + Windows thì cài Docker nó có luôn, Linux thì phải cài riêng)

- Tạo file .env theo mẫu trong .env.sample, có thể dùng value cho các env vars giống luôn cũng dc nha

- Start Docker Desktop, rồi vào terminal trong project gọi: docker compose up -d
  Khúc này xong có thể vô Docker Desktop check xem nó lên chưa, nếu có DB client như pgAdmin hay DBeaver có thể connect vô thử
  Nếu muốn clear toàn bộ containers + data của nó: docker compose down -v

- Set biến môi trường
  MacOS - Linux: export PRISMA_DB_URL="postgresql://postgres:123456@localhost:5432/flavornest-db?schema=public"
  Windows: set PRISMA_DB_URL=postgresql://postgres:123456@localhost:5432/flavornest-db?schema=public
- Từ terminal chạy các lệnh sau:
  npm install
  npx prisma generate -> Generate Prisma ORM
  npx prisma migrate dev -> Tạo các table theo script prisma/schema.prisma
  npx prisma db seed (optional) -> Đổ mock data theo script prisma/seed.ts

- Start app:
  npm run dev
  Port default là 3000

- Test APIs:
  Dùng Postman import file "flavornest-be.postman_collection.json" trong project
  Tùy API mà có thể sẽ require login, Gọi API register -> login để nó set Cookie trước khi test các APIs khác
