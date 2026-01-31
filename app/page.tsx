//メイン画面
"use client";

import { Ruthie } from "next/font/google";
import { useEffect, useState } from "react";
import { runInThisContext } from "vm";

// 時間によって背景を変える(使うと天気情報の温度、湿度、風速が表示されない)
// function getTimeClass(){
//   const hour = new Date().getHours()
//   if(hour >= 5 && hour< 10){
//     return "bg-morning";
//   } else if(hour >= 10 && hour < 17 ){
//     return "bg-day";
//   } else if(hour >= 17 && hour < 19){
//     return "bg-evening";
//   } else {
//     return "bg-night";
//   }
// }

function getDayLabel(unix: number){
  return new Date(unix * 1000).toLocaleDateString("ja-JP",{
    weekday: "short",
  });
}

export default function Home(){
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState("");
  
  //ユーザーの位置情報が取得できなければエラー
  useEffect(()=>{
    if(!navigator.geolocation){
      setError("位置情報が使えません")
      return
    };

    //ユーザーの現在地を取得する許可をもらう
    navigator.geolocation.getCurrentPosition(
      async(position) => {
        const {latitude, longitude} = position.coords
        const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        const foreCast = await fetch(`/api/forecast?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const data_forecast = await foreCast.json();
        setWeather(data);
        setForecast(data_forecast);
        console.log(data);
        console.log(data_forecast);
      },
      //ユーザーが拒否すればエラー
      () =>{
        setError("位置情報の取得が拒否されました")
      }
    );
  },[]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">現在地の天気</h1>

        {error && <p>{error}</p>}

        {weather && (
          <>
          <div className="main">

            <p className="city">{weather.name}</p>

            <div className="weather-container">
              <img className="icon" src={`https://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@2x.png`} alt="天気アイコン" />
              <p className="temp">{Math.round(weather.main.temp)}°</p>
            </div>
            
            <p className="desc">{forecast.list[0].weather[0].description}</p>
          </div>

          <div className="sub">
            <div>湿度{forecast.list[0].main.humidity}%</div>
            <div>風速{forecast.list[0].wind.speed}m/s</div>
          </div>

          {/* 週間予報 */}
          <div className="weekly">
            {/* <div className="weekly-title">週間予報</div> */}

            <div className="weekly-list">
              {forecast.list
                .filter((_:any, index: number) => index % 8 === 0)
                .slice(1,6) //当日を除外して、翌日から
                .map((day: any, i:number) =>(
                <div className="weekly-item" key={i}>
                  <div>{getDayLabel(day.dt)}</div>

                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="天気アイコン" />

                  <div className="weekly-temp">
                    {Math.round(day.main.temp)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
        )}
      </div>
    </div>

  );
}


// return (
//     <div className="">
//       <div className="screen">
//         {weather && (
//           <>
//             <div className="header">{weather.name}</div>

//             <div className="main">
//               <img
//                 className="icon"
//                 src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
//               />
//               <div className="desc">
//                 {weather.weather[0].description}
//               </div>
//               <div className="temp">
//                 {Math.round(weather.main.temp)}°
//               </div>
//             </div>

//             <div className="sub">
//               <div>湿度 {weather.main.humidity}%</div>
//               <div>風速 {weather.wind.speed}m/s</div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }