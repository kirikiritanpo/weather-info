import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    //経度と緯度が取得できなかったらエラー
    if(!lat || !lon){
        return Response.json({error: "位置情報がありません"}, {status: 400})
    }

    // openweatherに非同期でアクセス
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&lang=ja&units=metric`)
   

    //アクセスしたデータをJSON形式にしてResponse
    const data = await res.json()
    return Response.json(data)
}