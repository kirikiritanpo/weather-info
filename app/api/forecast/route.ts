import { NextRequest } from "next/server";

//予報を出すためにforecast版
export async function GET(req: NextRequest) {
    const { searchParams} = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if(!lat || !lon){
        return Response.json(
            { error: "位置情報がありません"},
            { status: 400}
        );
    }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&lang=ja&units=metric`
    );

    const data = await res.json();
    return Response.json(data);
}
