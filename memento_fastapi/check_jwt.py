import jwt

token = jwt.encode({"sub": "test"}, "mysecret", algorithm="HS256")
print("✅ JWT 토큰:", token)

decoded = jwt.decode(token, "mysecret", algorithms=["HS256"])
print("✅ 복호화 결과:", decoded)