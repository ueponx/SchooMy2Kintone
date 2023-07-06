//------------------
// SpreadSheet間の差分を比較し、足りない場合にはデータをコピーする処理
//------------------
const sourceURL = 'https://docs.google.com/spreadsheets/d/1l4ryA8xXIJsKjv7m8Yeng1rslFFgK3b2gHlczsTBJKA/';
const distURL = 'https://docs.google.com/spreadsheets/d/1tfG-1qyXe7CdeBDtxvtAGpVTkB7uOaEpv4_hvompA34/';

function myFunction() {
  //コピー元のシート情報
  let sourceSheet = SpreadsheetApp.openByUrl(sourceURL).getSheetByName('Sheet1');

  //コピー先のシート情報
  let distSheet = SpreadsheetApp.openByUrl(distURL).getSheetByName('Sheet1');

  //console.log(sourceSheet.getLastRow() ,sourceSheet.getLastColumn());
  //console.log(distSheet.getLastRow(),distSheet.getLastColumn());

  let updateRows = sourceSheet.getLastRow()-distSheet.getLastRow(); 
  let updateCols = sourceSheet.getLastColumn();//sourceSheet.getLastColumn()-distSheet.getLastColumn();

  if(updateRows == 0) {
    console.log('更新なし　→　終了');
    return; //データの更新がなければ何もせず終了
  }
  console.log(`更新範囲は${updateRows}行, ${updateCols}列`);
  console.log(`追記開始位置は${distSheet.getLastRow()+1}行目からです`)

  //コピーしたい範囲の値を取得
  let values = sourceSheet.getRange(distSheet.getLastRow()+1, 1 ,updateRows, updateCols).getValues();
  console.log(values);

  //コピー先にペースト
  distSheet.getRange(distSheet.getLastRow()+1, 1, updateRows, updateCols).setValues(values);
}

//------------------
// Kintone用のコード群
//------------------
const KINTONE_URL = 'https://yfwrse5l4o1g.cybozu.com';
const APP_ID = 3;
const APP_API_TOKEN = 'zKGkNEuGhaDKP8LE6YOjSmlUoXYu1yuoaSyuNCso';

const getKintoneRecord = (app, appApiToken, id) => {
  const apiResponse =  UrlFetchApp.fetch(`${KINTONE_URL}/k/v1/record.json?app=${app}&id=${id}`, {
    method: 'get',
    headers: {
      'X-Cybozu-API-Token': appApiToken
    }
  })
  return apiResponse.getContentText()
}

const postKintoneRecord = (app, appApiToken, record) => {
  const apiResponse =  UrlFetchApp.fetch(`${KINTONE_URL}/k/v1/record.json`, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'X-Cybozu-API-Token': appApiToken
    },
    payload: JSON.stringify({app, record})
  })
  console.log({app, record});
  return apiResponse.getContentText()
}

function postKintoneRecordWithParam(date, time, temp, rh){
  let response = postKintoneRecord(APP_ID, APP_API_TOKEN,
  {
    "date": {
      "value": date
    },
    "time": {
      "value": time
    },
    "temp": {
      "value": temp
    },
    "humi": {
      "value": rh
    },
  });
  console.log(response)
  let id = JSON.parse(response).id
}

//------------------
// 最終的に実行するのはこのfunction()
//------------------
function appendAllRecordsToKintone(){
  //コピー元のシート情報
  let sourceSheet = SpreadsheetApp.openByUrl(sourceURL).getSheetByName('Sheet1');

  //コピー先のシート情報
  let distSheet = SpreadsheetApp.openByUrl(distURL).getSheetByName('Sheet1');

  //console.log(sourceSheet.getLastRow() ,sourceSheet.getLastColumn());
  //console.log(distSheet.getLastRow(),distSheet.getLastColumn());

  let updateRows = sourceSheet.getLastRow()-distSheet.getLastRow(); 
  let updateCols = sourceSheet.getLastColumn();//sourceSheet.getLastColumn()-distSheet.getLastColumn();

  if(updateRows == 0) {
    console.log('更新なし　→　終了');
    return; //データの更新がなければ何もせず終了
  }
  console.log(`更新範囲は${updateRows}行, ${updateCols}列`);
  console.log(`追記開始位置は${distSheet.getLastRow()+1}行目からです`)

  //コピーしたい範囲の値を取得
  let values = sourceSheet.getRange(distSheet.getLastRow()+1, 1 ,updateRows, updateCols).getValues();
  //console.log(values);
  for(let value of values){
    //console.log(value[0].replace(/\//g, '-'), "" ,value[1], "" ,value[2], "" ,value[3]);
    postKintoneRecordWithParam(value[0].replace(/\//g, '-'), value[1], value[2], value[3]);
  }

  //コピー先にペースト
  distSheet.getRange(distSheet.getLastRow()+1, 1, updateRows, updateCols).setValues(values);
}

// function fetchSample1(){
//   let ret = getKintoneRecord(APP_ID, APP_API_TOKEN, 1);
//   console.log(JSON.parse(ret));
// }

// function fetchSample2(){
//   let createRecord = postKintoneRecord(APP_ID, APP_API_TOKEN,
//   {
//     "日付": {
//       "value": "2023-06-22"
//     },
//     "時刻": {
//       "value": "12:00"
//     },
//     "温度": {
//       "value": 25.5
//     },
//     "湿度": {
//       "value": 60.21
//     },
//   });
//   console.log(createRecord)
//   let id = JSON.parse(createRecord).id
// }
