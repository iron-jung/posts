# 베이스 이미지로 사용할 Node.js 이미지 선택
FROM node:16-alpine

# 앱 디렉토리 생성 및 작업 디렉토리로 설정
WORKDIR /app

# 필요한 패키지를 설치
RUN apk add --no-cache vips

# package.json과 package-lock.json 복사
COPY package*.json ./

# 필요한 패키지 설치
RUN npm install

# 소스 코드 복사
COPY . .

# "sharp" 모듈을 다시 빌드
RUN npm rebuild sharp

# 앱 실행
#CMD ["npm", "start"]
CMD ["sh", "-c", "npm run build && npm run start"]
