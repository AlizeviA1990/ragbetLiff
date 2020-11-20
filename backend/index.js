const request = require('request-promise')

//Verifying Access Token and Channel ID
// Access Token ตัวนี้ไม่ใช่ Channel Access Token 
// แต่เป็น Access Token ของ Liff ที่ จะ generate ใหม่
// ทุกครั้งที่ liff rewoke ขึ้นมา เวลาที่เราต้องการจะ post หรือ submit
// ฟอร์มไปที่หลังบ้าน token ตัวนี้จะช่วย verify ว่า request ที่วิ่งเข้ามา
// ถูกปลอมแปลงเข้ามารึป่าว
const json = await request.get({
  url: `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`,
  json: true
})

// จากนั่น json ที่ได้จากข้างบนจะมี client_id ติดมาด้วย ให้เราเช็คว่า ตรงกับ channel_id ของเราไหม? ถ้าไม่ตรงก็มั่วมาละ
if (json.client_id !== CHANNEL_ID) {
  return 401
}


//Getting User Profile by Access Token
const profile = await request.get({
  url: "https://api.line.me/v2/profile",
  headers: { Authorization: `Bearer ${accessToken}` },
  json: true
})


// Revoke Access Token
// ปกติเวลาที่เรากดปิด liff มันจะ revoke access token ให้เราอัตโนมัติ
// แต่ในกรณีที่เราอยาก revoke access เองก็สามารถทำได้
// ตัวอย่างเช่น liff form สมัครสมาชิก เมื่อกด sumbit โดยที่ไม่มี action ใด ๆ 
// ต่อจากนั้น อยากจะปิด liff ลงไปเลย กรณีแบบนี้การ revoke access token ก็จะช่วยให้ตัว liff
// ของเราปลอดภัยมากขึ้น
await request.post({
 url: "https://api.line.me/oauth2/v2.1/revoke",
 headers: { "Content-Type": "application/x-www-form-urlencoded" },
 form: {
   access_token: `${accessToken}`,
   client_id: CHANNEL_ID,
   client_secret: CHANNEL_SECRET
 } 
})

