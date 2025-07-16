var cron = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var request = require('request');
var fs = require('fs');
const fastify = require('fastify')({ logger: true });
const Rcon = require('rcon-client').Rcon;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { google } = require('googleapis');
var admin = require("firebase-admin");

var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//require('dotenv').config()
require('dotenv').config()

const options = {
  host: '192.168.31.220',
  port: 25575,
  password: 'minecraft'
};

const hardserveroptions = {
  host: '192.168.31.220',
  port: process.env.hardport,
  password: 'minecraft'
};

const gunserveroptions = {
  host: '192.168.31.220',
  port: process.env.gunport,
  password: 'minecraft'
};

const rcon = new Rcon(options);
const hardrcon = new Rcon(hardserveroptions);
const gunrcon = new Rcon(gunserveroptions);

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require("./firebase-adminsdk.json");
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/firebase.messaging'],
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

cron.schedule('15 9 * * *', async () => {
  /*await fetch('https://www.google.com')
  .then(response => {
      // Handle response
      console.log('good')
  })
  .catch(error => {
      if (error instanceof AbortError) {
          // Handle timeout
      }
  })
  console.log('done')*/
  //fetch https://thai-lottery1.p.rapidapi.com/getchit
  let thisdayislottery = 'no'
  //let imagearray = []
  //const response = await fetch('https://thai-lottery1.p.rapidapi.com/reto', {'method': 'GET', 'headers': {'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com', 'x-rapidapi-key': process.env.RAPIDAPI_KEY}});
  const response = await fetch('http://192.168.31.210:5000/reto');
  thisdayislottery = await response.text();
  //if thisdayislottery is json then it is error
  if (thisdayislottery.length > 10) {
    thisdayislottery = 'error'
  }
  console.log(thisdayislottery)
  //thisdayislottery = 'yes'
  // if (thisdayislottery == 'yes') {
  //   //const rechit = await fetch('https://thai-lottery1.p.rapidapi.com/getchit', {'method': 'GET', 'headers': {'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com', 'x-rapidapi-key': process.env.RAPIDAPI_KEY}});
  //   const rechit = await fetch('http://192.168.31.210:5000/getchit');
  //   const rechitjson = await rechit.json();
  //   //add rechitjson json array to imagearray
  //   //imagearray = rechitjson
  //   //fetch https://lottsanook-chitai-production.up.railway.app/ai
  //   // const responseai = await fetch('https://lottsanook-chitai.vercel.app/ai');
  //   // const responseaijson = await responseai.json();
  //   //raw body
  //   var raw = JSON.stringify({
  //     "messages": [
  //       {
  //         "type": "flex",
  //         "altText": "เลขเด็ดงวดนี้",
  //         "contents": {
  //           "type": "carousel",
  //           "contents": [
  //             // {
  //             //   "type": "bubble",
  //             //   "header": {
  //             //     "type": "box",
  //             //     "layout": "vertical",
  //             //     "contents": [
  //             //       {
  //             //         "type": "text",
  //             //         "text": "10 อันดับเลขดังจาก จะถูกไหมนะ AI",
  //             //         "align": "center",
  //             //         "weight": "bold"
  //             //       }
  //             //     ]
  //             //   },
  //             //   "body": {
  //             //     "type": "box",
  //             //     "layout": "horizontal",
  //             //     "contents": [
  //             //       {
  //             //         "type": "box",
  //             //         "layout": "vertical",
  //             //         "contents": [
  //             //           {
  //             //             "type": "text",
  //             //             "text": "1. " + responseaijson[0].key + "",
  //             //             "weight": "bold",
  //             //             "size": "3xl"
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "2. " + responseaijson[1].key + "",
  //             //             "size": "xxl"
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "3. " + responseaijson[2].key + "",
  //             //             "size": "xl"
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "4. " + responseaijson[3].key + ""
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "5. " + responseaijson[4].key + ""
  //             //           }
  //             //         ]
  //             //       },
  //             //       {
  //             //         "type": "box",
  //             //         "layout": "vertical",
  //             //         "contents": [
  //             //           {
  //             //             "type": "text",
  //             //             "text": "6. " + responseaijson[5].key + ""
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "7. " + responseaijson[6].key + ""
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "8. " + responseaijson[7].key + ""
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "9. " + responseaijson[8].key + ""
  //             //           },
  //             //           {
  //             //             "type": "text",
  //             //             "text": "10. " + responseaijson[9].key + ""
  //             //           }
  //             //         ]
  //             //       }
  //             //     ],
  //             //     "paddingBottom": "none"
  //             //   },
  //             //   "footer": {
  //             //     "type": "box",
  //             //     "layout": "vertical",
  //             //     "contents": [
  //             //       {
  //             //         "type": "box",
  //             //         "layout": "vertical",
  //             //         "contents": [
  //             //           {
  //             //             "type": "button",
  //             //             "action": {
  //             //               "type": "uri",
  //             //               "label": "ดูเลขเด็ดเพิ่มเติม",
  //             //               "uri": "https://lottsanook-chitai-production.up.railway.app/"
  //             //             }
  //             //           }
  //             //         ],
  //             //         "backgroundColor": "#FFD700",
  //             //         "cornerRadius": "xxl",
  //             //         "background": {
  //             //           "type": "linearGradient",
  //             //           "angle": "0deg",
  //             //           "startColor": "#FFD700",
  //             //           "endColor": "#ffffff"
  //             //         }
  //             //       }
  //             //     ]
  //             //   },
  //             //   "styles": {
  //             //     "body": {
  //             //       "separator": true
  //             //     }
  //             //   }
  //             // },
  //             {
  //               "type": "bubble",
  //               "body": {
  //                 "type": "box",
  //                 "layout": "vertical",
  //                 "contents": [
  //                   {
  //                     "type": "image",
  //                     "url": "" + rechitjson[0] + "",
  //                     "size": "full"
  //                   }
  //                 ],
  //                 "paddingAll": "none"
  //               }
  //             },
  //             {
  //               "type": "bubble",
  //               "body": {
  //                 "type": "box",
  //                 "layout": "vertical",
  //                 "contents": [
  //                   {
  //                     "type": "image",
  //                     "url": "" + rechitjson[1] + "",
  //                     "size": "full"
  //                   }
  //                 ],
  //                 "paddingAll": "none"
  //               }
  //             },
  //             {
  //               "type": "bubble",
  //               "body": {
  //                 "type": "box",
  //                 "layout": "vertical",
  //                 "contents": [
  //                   {
  //                     "type": "image",
  //                     "url": "" + rechitjson[2] + "",
  //                     "size": "full"
  //                   }
  //                 ],
  //                 "paddingAll": "none"
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     ]
  //   });
  //   //post to https://api.line.me/v2/bot/message/broadcast
  //   const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
  //   const responselinejson = await responseline.json();
  //   console.log(responselinejson);
  // }
  //console.log(imagearray)
  /*await fetch("https://thai-lottery1.p.rapidapi.com/getchit", {
      "method": "GET",
      "headers": {
          "x-rapidapi-host": "thai-lottery1.p.rapidapi.com",
          "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137"
      }
  }).then(response => {
      console.log(response);
  }).catch(err => {
      console.error(err);
  });*/
  if (thisdayislottery == 'yes') {
    const weeknews = await fetch('https://lotapi.pwisetthon.com/lotnews?count=4&lastweek=true')
    const weeknewsjson = await weeknews.json();
    var raw = {
      "type": "bubble",
      "size": "giga",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": weeknewsjson[0].image,
                    "size": "full",
                    "aspectMode": "cover",
                    "aspectRatio": "1:1",
                    "animated": true
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": weeknewsjson[0].title,
                        "color": "#ffffff",
                        "size": "lg",
                        "maxLines": 2,
                        "weight": "bold",
                        "wrap": true,
                        "align": "center",
                        "offsetBottom": "5px"
                      }
                    ],
                    "position": "absolute",
                    "offsetBottom": "none",
                    "background": {
                      "type": "linearGradient",
                      "angle": "0deg",
                      "startColor": "#000000",
                      "endColor": "#00000000"
                    },
                    "width": "100%",
                    "alignItems": "center",
                    "height": "25%",
                    "justifyContent": "flex-end"
                  }
                ],
                "paddingAll": "none",
                "action": {
                  "type": "uri",
                  "label": "action",
                  "uri": weeknewsjson[0].link
                }
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": weeknewsjson[1].image,
                    "size": "full",
                    "aspectMode": "cover",
                    "aspectRatio": "1:1",
                    "animated": true
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": weeknewsjson[1].title,
                        "color": "#ffffff",
                        "size": "lg",
                        "maxLines": 2,
                        "weight": "bold",
                        "wrap": true,
                        "align": "center",
                        "offsetBottom": "5px"
                      }
                    ],
                    "position": "absolute",
                    "offsetBottom": "none",
                    "background": {
                      "type": "linearGradient",
                      "angle": "0deg",
                      "startColor": "#000000",
                      "endColor": "#00000000"
                    },
                    "width": "100%",
                    "alignItems": "center",
                    "height": "25%",
                    "justifyContent": "flex-end"
                  }
                ],
                "paddingAll": "none",
                "action": {
                  "type": "uri",
                  "label": "action",
                  "uri": weeknewsjson[1].link
                }
              }
            ],
            "paddingAll": "none"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": weeknewsjson[2].image,
                    "size": "full",
                    "aspectMode": "cover",
                    "aspectRatio": "1:1",
                    "animated": true
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": weeknewsjson[2].title,
                        "color": "#ffffff",
                        "size": "lg",
                        "maxLines": 2,
                        "weight": "bold",
                        "wrap": true,
                        "align": "center",
                        "offsetBottom": "5px"
                      }
                    ],
                    "position": "absolute",
                    "offsetBottom": "none",
                    "background": {
                      "type": "linearGradient",
                      "angle": "0deg",
                      "startColor": "#000000",
                      "endColor": "#00000000"
                    },
                    "width": "100%",
                    "alignItems": "center",
                    "height": "25%",
                    "justifyContent": "flex-end"
                  }
                ],
                "paddingAll": "none",
                "action": {
                  "type": "uri",
                  "label": "action",
                  "uri": weeknewsjson[2].link
                }
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": weeknewsjson[3].image,
                    "size": "full",
                    "aspectMode": "cover",
                    "aspectRatio": "1:1",
                    "animated": true
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": weeknewsjson[3].title,
                        "color": "#ffffff",
                        "size": "lg",
                        "maxLines": 2,
                        "weight": "bold",
                        "wrap": true,
                        "align": "center",
                        "offsetBottom": "5px"
                      }
                    ],
                    "position": "absolute",
                    "offsetBottom": "none",
                    "background": {
                      "type": "linearGradient",
                      "angle": "0deg",
                      "startColor": "#000000",
                      "endColor": "#00000000"
                    },
                    "width": "100%",
                    "alignItems": "center",
                    "height": "25%",
                    "justifyContent": "flex-end"
                  }
                ],
                "paddingAll": "none",
                "action": {
                  "type": "uri",
                  "label": "action",
                  "uri": weeknewsjson[3].link
                }
              }
            ],
            "paddingAll": "none"
          }
        ],
        "paddingAll": "none"
      }
    };
    let altText = "ข่าวเลขเด็ดในงวดนี้";
    raw = JSON.stringify({
      "messages": [
        {
          "type": "flex",
          "altText": altText,
          "contents": {
            "type": "carousel",
            "contents": [raw]
          }
        }
      ]
    })
    const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
    const responselinejson = await responseline.json();
    console.log(responselinejson);
  }
});

cron.schedule('0-10,50-59 14-17 * * *', async () => {
  //fetch https://lotto.teamquadb.in.th/aday.php
  /*const response = await fetch('https://lotto.teamquadb.in.th/aday.php');
  const responsetext = await response.text();
  console.log(responsetext);*/
  //fetch https://thai-lottery1.p.rapidapi.com/?date=17042565 with headers
  //get todays date format DDMMYYYY with convert year to buddhist year
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear() + 543;
  var todaydate = dd + mm + yyyy;
  const response = await fetch('https://thai-lottery1.p.rapidapi.com/?date=' + todaydate, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "thai-lottery1.p.rapidapi.com",
      "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137"
    }
  });
  console.log(response.status);
  const responsejson = await response.json();
  //console.log(responsejson);
  //if responsejson[0][1] != 0 or XXXXXX
  if (response.status == "success" || response.status == 200) {
    console.log(responsejson[0][1]);
    if (responsejson[0][1] != '0' && responsejson[0][1] != 0 && responsejson[0][1].toUpperCase() != "XXXXXX") {
      const response = await fetch('https://lotto.teamquadb.in.th/aday.php');
      const responsetext = await response.text();
      console.log(responsetext);
      const lotpost = await fetch('https://lotpost.teamquadb.in.th/aday.php');
      const lotposttext = await lotpost.text();
      console.log(lotposttext);
      if (responsetext == "success") {
        //log success
        console.log("successfull");
      }
    } else if (responsejson[0][1] == '0' || responsejson[0][1] == 0) {
      //remove last.txt file
      fs.unlinkSync('./last.txt');
    }
    if ((parseInt(responsejson[8][1]) != 0 || parseInt(responsejson[7][1]) != 0 || parseInt(responsejson[6][1]) != 0) && (responsejson[8][1].toUpperCase() != "XXXXXX" || responsejson[7][1].toUpperCase() != "XXXXXX" || responsejson[6][1].toUpperCase() != "XXXXXX") && today.getHours() < 15) {
      const youtubeapi = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&channelId=UC0xykk-LCkhdxjFl2gdMkkQ&order=date&key=' + process.env.YOUTUBE_API_KEY);
      const youtubeapijson = await youtubeapi.json();
      if (youtubeapijson.pageInfo.totalResults > 0) {
        if (youtubeapijson.items[0].snippet.liveBroadcastContent == 'live') {
          var youtubeimage = youtubeapijson.items[0].snippet.thumbnails.medium.url || youtubeapijson.items[0].snippet.thumbnails.default.url;

          const token = await getAccessToken();

          const notiBody = {
            message: {
              notification: {
                title: 'เริ่มแล้วการถ่ายทอดสด สลากกินแบ่งฯ',
                body: youtubeapijson.items[0].snippet.title + " | url:https://www.youtube.com/watch?v=" + youtubeapijson.items[0].id.videoId,
                image: youtubeapijson.items[0].snippet.thumbnails.default.url
              },
              topic: 'all'
            }
          }

          var raw = {
            "type": "bubble",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://www.youtube.com/watch?v=" + youtubeapijson.items[0].id.videoId
            },
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "image",
                      "url": youtubeimage,
                      "size": "full",
                      "aspectMode": "cover",
                      "aspectRatio": "16:9",
                      "flex": 1
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "LIVE",
                          "size": "xs",
                          "color": "#ffffff",
                          "align": "center",
                          "gravity": "center"
                        }
                      ],
                      "backgroundColor": "#EC3D44",
                      "paddingAll": "2px",
                      "paddingStart": "4px",
                      "paddingEnd": "4px",
                      "flex": 0,
                      "position": "absolute",
                      "offsetStart": "18px",
                      "offsetTop": "18px",
                      "cornerRadius": "100px",
                      "width": "48px",
                      "height": "25px"
                    }
                  ]
                }
              ],
              "paddingAll": "0px"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "contents": [],
                          "size": "xl",
                          "wrap": true,
                          "text": youtubeapijson.items[0].snippet.title,
                          "color": "#ffffff",
                          "weight": "bold",
                          "maxLines": 1
                        },
                        {
                          "type": "text",
                          "text": "เริ่มแล้วการถ่ายทอดสด สลากกินแบ่งฯ",
                          "color": "#ffffffcc",
                          "size": "sm"
                        }
                      ],
                      "spacing": "sm"
                    }
                  ]
                }
              ],
              "paddingAll": "20px",
              "backgroundColor": "#464F69"
            }
          }

          raw = JSON.stringify({
            "messages": [
              {
                "type": "flex",
                "altText": "เริ่มแล้ว! การถ่ายทอดสดสลากกินแบ่งฯ ประจำงวดนี้",
                "contents": {
                  "type": "carousel",
                  "contents": [raw]
                }
              }
            ]
          })

          if (fs.existsSync('./last.txt') == false) {
            const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
            const responselinejson = await responseline.json();
            console.log(responselinejson);
            
            const fcmHeaders = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
  
            const fcmResponse = await fetch('https://fcm.googleapis.com/v1/projects/wrblob/messages:send', {
              method: 'POST',
              headers: fcmHeaders,
              body: JSON.stringify(notiBody)
            });

            fs.writeFileSync('./last.txt', youtubeapijson.items[0].id.videoId);
          }
        }
      }
    }
  }
});

cron.schedule('0 11 * * *', async () => {
  //fetch https://lotto.teamquadb.in.th/aday.php
  const today = await fetch('https://lotapi3.pwisetthon.com/reto')
  const todaytext = await today.text();
  if (todaytext != "no") {
    const response = await fetch('https://lotto.teamquadb.in.th/aday.php');
    const responsetext = await response.text();
    console.log(responsetext);
  }
});

cron.schedule('30 10 * * 0', async () => {
  const weeknews = await fetch('https://lotapi.pwisetthon.com/lotnews?count=4&lastweek=true')
  const weeknewsjson = await weeknews.json();
  var raw = {
    "type": "bubble",
    "size": "giga",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": weeknewsjson[0].image,
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "1:1",
                  "animated": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": weeknewsjson[0].title,
                      "color": "#ffffff",
                      "size": "lg",
                      "maxLines": 2,
                      "weight": "bold",
                      "wrap": true,
                      "align": "center",
                      "offsetBottom": "5px"
                    }
                  ],
                  "position": "absolute",
                  "offsetBottom": "none",
                  "background": {
                    "type": "linearGradient",
                    "angle": "0deg",
                    "startColor": "#000000",
                    "endColor": "#00000000"
                  },
                  "width": "100%",
                  "alignItems": "center",
                  "height": "25%",
                  "justifyContent": "flex-end"
                }
              ],
              "paddingAll": "none",
              "action": {
                "type": "uri",
                "label": "action",
                "uri": weeknewsjson[0].link
              }
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": weeknewsjson[1].image,
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "1:1",
                  "animated": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": weeknewsjson[1].title,
                      "color": "#ffffff",
                      "size": "lg",
                      "maxLines": 2,
                      "weight": "bold",
                      "wrap": true,
                      "align": "center",
                      "offsetBottom": "5px"
                    }
                  ],
                  "position": "absolute",
                  "offsetBottom": "none",
                  "background": {
                    "type": "linearGradient",
                    "angle": "0deg",
                    "startColor": "#000000",
                    "endColor": "#00000000"
                  },
                  "width": "100%",
                  "alignItems": "center",
                  "height": "25%",
                  "justifyContent": "flex-end"
                }
              ],
              "paddingAll": "none",
              "action": {
                "type": "uri",
                "label": "action",
                "uri": weeknewsjson[1].link
              }
            }
          ],
          "paddingAll": "none"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": weeknewsjson[2].image,
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "1:1",
                  "animated": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": weeknewsjson[2].title,
                      "color": "#ffffff",
                      "size": "lg",
                      "maxLines": 2,
                      "weight": "bold",
                      "wrap": true,
                      "align": "center",
                      "offsetBottom": "5px"
                    }
                  ],
                  "position": "absolute",
                  "offsetBottom": "none",
                  "background": {
                    "type": "linearGradient",
                    "angle": "0deg",
                    "startColor": "#000000",
                    "endColor": "#00000000"
                  },
                  "width": "100%",
                  "alignItems": "center",
                  "height": "25%",
                  "justifyContent": "flex-end"
                }
              ],
              "paddingAll": "none",
              "action": {
                "type": "uri",
                "label": "action",
                "uri": weeknewsjson[2].link
              }
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": weeknewsjson[3].image,
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "1:1",
                  "animated": true
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": weeknewsjson[3].title,
                      "color": "#ffffff",
                      "size": "lg",
                      "maxLines": 2,
                      "weight": "bold",
                      "wrap": true,
                      "align": "center",
                      "offsetBottom": "5px"
                    }
                  ],
                  "position": "absolute",
                  "offsetBottom": "none",
                  "background": {
                    "type": "linearGradient",
                    "angle": "0deg",
                    "startColor": "#000000",
                    "endColor": "#00000000"
                  },
                  "width": "100%",
                  "alignItems": "center",
                  "height": "25%",
                  "justifyContent": "flex-end"
                }
              ],
              "paddingAll": "none",
              "action": {
                "type": "uri",
                "label": "action",
                "uri": weeknewsjson[3].link
              }
            }
          ],
          "paddingAll": "none"
        }
      ],
      "paddingAll": "none"
    }
  };
  const today = await fetch('https://lotapi.pwisetthon.com/reto');
  const todaytext = await today.text();
  let altText = "ข่าวสลากฯอาทิตย์นี้";
  if (todaytext == 'yes') {
    altText = "ข่าวเลขเด็ดในงวดนี้";
  }
  raw = JSON.stringify({
    "messages": [
      {
        "type": "flex",
        "altText": altText,
        "contents": {
          "type": "carousel",
          "contents": [raw]
        }
      }
    ]
  })
  const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
  const responselinejson = await responseline.json();
  console.log(responselinejson);
})

console.log('cron starting');

fastify.get('/testpost', async (req, reply) => {
  const pageid = req.query.pageid;
  const pageaccesstoken = req.query.pageaccesstoken;
  const pagemsg = req.query.pagemsg;
  const pagemsgdecode = encodeURIComponent(pagemsg);
  const imgurl = req.query.imgurl;
  const imgfetch = await fetch(imgurl);
  const imgbuf = await imgfetch.buffer();
  await fs.writeFileSync('test.jpg', imgbuf);
  var options = {
    'method': 'POST',
    'url': 'https://graph.facebook.com/v8.0/' + pageid + '/photos?access_token=' + pageaccesstoken + '&message=' + pagemsgdecode,
    formData: {
      'source': {
        'value': fs.createReadStream('test.jpg'),
        'options': {
          'filename': 'test.jpg',
          'contentType': null
        }
      }
    }
  };
  //let response = await request(options);
  //return response.body;
  return request(options, function (error, response) {
    if (error) throw new Error(error);
    //console.log(response.body);
    return response.body;
  });
})

fastify.get('/sendrcon', async (req, reply) => {
  const message = req.query.message;
  rcon.connect().then(() => {
    rcon.send('broadcast chat ' + message);
    rcon.end();
  }).catch((err) => {
    console.log(err);
    return err;
  });
  //setheader accept only bpminecraft.com
  reply.header('Access-Control-Allow-Origin', 'https://bpminecraft.com');
  return reply.send('ok');
});

fastify.get('/sendpoweroutagealert', async (req, reply) => {
  const message = req.query.message;
  // rcon.connect().then(() => {
  //   rcon.send('broadcast ' + message);
  //   rcon.end();
  // }).catch((err) => {
  //   console.log(err);
  //   return err;
  // });
  hardrcon.connect().then(() => {
    hardrcon.send('say ' + message).then(() => {
      hardrcon.end();
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }).catch((err) => {
    console.log(err);
    return err;
  });
  gunrcon.connect().then(() => {
    gunrcon.send('say ' + message).then(() => {
      gunrcon.end();
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }).catch((err) => {
    console.log(err);
    return err;
  });
  //setheader accept only localhost
  reply.header('Access-Control-Allow-Origin', 'http://localhost:9400');
  return reply.send('ok');
});

fastify.get('/gettempbyopenai', async (req, reply) => {
  const roomtemp = req.query.roomtemp;
  const aircontempset = req.query.aircontempset;
  const outsidetemp = req.query.outsidetemp;
  const whattempwant = req.query.whattempwant;
  // const { Configuration, OpenAIApi } = require("openai");
  // const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY
  // });
  // const openai = new OpenAIApi(configuration);
  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: "If the room temperature is "+roomtemp+"°C and the air conditioning is set at "+aircontempset+"°C while the outside temperature is "+outsidetemp+", what temperature should the air conditioning be set to in order to achieve a room temperature of "+whattempwant+"°C? (answer only number)",
  //   temperature: 1,
  //   max_tokens: 160,
  //   top_p: 0.5,
  //   frequency_penalty: 0,
  //   presence_penalty: 0.6,
  // });
  // reply.header('Access-Control-Allow-Origin', '*');
  // console.log(response.data);
  // return reply.send(response.data.choices[0].text);
  // await fetch('https://iask.ai/?mode=question&q=i+want+number+answer+only%2C+If+room+temperature+is+28%C2%B0C+and+outside+temperature+is+30%2C+what+temperature+should+the+air+conditioning+be+set+to+in+order+to+achieve+a+room+temperature+of+26%C2%B0C%3F+')
  // .then(res => res.text())
  // .then(body => {
  //   console.log(body);
  //   reply.header('Access-Control-Allow-Origin', '*');
  //   return reply.send(body);
  // });
  try {
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--disable-extensions'], headless: "new" });
    const page = await browser.newPage();
    await page.goto('https://iask.ai/?mode=academic&q=i+want+number+answer+only%2C+If+room+temperature+is+' + roomtemp + '%C2%B0C+and+outside+temperature+is+' + outsidetemp + '%2C+what+temperature+should+the+air+conditioning+be+set+to+in+order+to+achieve+a+room+temperature+of+' + whattempwant + '%C2%B0C%3F+');
    //wait 10 second
    await page.waitForTimeout(10000);
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    await browser.close();
    const $ = cheerio.load(bodyHTML);
    // get text in div class prose
    // const text = $('div.prose').text();
    // div id text
    const text = $('div#text').text();
    // get text in span id output
    // const text = $('span#output').text();
    console.log(text);
    //if have ** after number, get number after **
    if (text.includes('**')) {
      let number = text.match(/\*\*(.*)/)[1];
      //get first number in text
      number = number.match(/\d+/)[0];
      reply.header('Access-Control-Allow-Origin', '*');
      return reply.send(number);
    }
    //get text after word should
    const textafter = text.match(/should(.*)/)[1];
    //get first number in text
    const number = textafter.match(/\d+/)[0];
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send(number);
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
});

// fastify.get('/openmainrouterwifi', async (req, reply) => {
//   const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--disable-extensions'] });
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1920, height: 1080 });
//   await page.goto('http://192.168.31.1/Main_Login.asp');
//   await page.waitForTimeout(5000);
//   await page.type('#login_username', 'admin');
//   // type on div name login_passwd
//   await page.$eval('input[name=login_passwd]', (el, value) => el.value = value, 'Team1556th_');
//   //use function login()
//   await page.evaluate(() => {
//     login();
//   });
//   await page.waitForTimeout(5000);
//   //change url to http://192.168.31.1/Advanced_WAdvanced_Content.asp
//   await page.goto('http://192.168.31.1/Advanced_WAdvanced_Content.asp');
//   await page.waitForTimeout(5000);
//   if (req.query.wifi) {
//     if (req.query.wifi == 'on') {
//       await page.click('input[name=wl_radio][value="1"]');
//     } else if (req.query.wifi == 'off') {
//       await page.click('input[name=wl_radio][value="0"]');
//     } else {
//       await page.click('input[name=wl_radio][value="1"]');
//     }
//   } else {
//     //if input name wl_radio value 1 is checked
//     if (await page.$eval('input[name=wl_radio][value="1"]', el => el.checked)) {
//       await page.click('input[name=wl_radio][value="0"]');
//     } else {
//       await page.click('input[name=wl_radio][value="1"]');
//     }
//   }
//   //use function applyRule()
//   await page.evaluate(() => {
//     applyRule();
//   });
//   await page.waitForTimeout(5000);
//   //use function logout() and click ok on alert
//   await page.evaluate(() => {
//     logout();
//   });
//   await page.waitForTimeout(5000);
//   await page.on('dialog', async dialog => {
//     await dialog.accept();
//   });
//   //get html
//   // const html = await page.content();
//   // console.log(html);
//   await browser.close();
//   reply.header('Access-Control-Allow-Origin', '*');
//   return reply.send('ok');
// });

fastify.get('/twitchstatus', async (req, reply) => {
  const twitchapitoken = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + process.env.TWITCH_CLIENT_ID + '&client_secret=' + process.env.TWITCH_CLIENT_SECRET + '&grant_type=client_credentials', { 'method': 'POST' });
  const twitchaccessjson = await twitchapitoken.json();
  const token = twitchaccessjson.access_token;
  const twitchapi = await fetch('https://api.twitch.tv/helix/streams?user_login=boyalone99', { 'headers': { 'Client-ID': process.env.TWITCH_CLIENT_ID, 'Authorization': 'Bearer ' + token } });
  const twitchapijson = await twitchapi.json();
  console.log(twitchapijson);
  if (twitchapijson.data.length > 0) {
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send(twitchapijson.data[0]);
  } else {
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send('offline');
  }
});

fastify.get('/fortniteitemshop', async (req, reply) => {
  //if file fortniteitemshop.json not exist
  if (!fs.existsSync('fortniteitemshop.json')) {
    const headers = {
      'Authorization': process.env.FORTNITE_API_IO_KEY
    }
    const fortniteitemshop = await fetch('https://fortniteapi.io/v2/shop?lang=th&includeRenderData=true', { 'headers': headers });
    const fortniteitemshopjson = await fortniteitemshop.json();
    let ggtext = '';
    try{
      const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--disable-extensions'], headless: "new", timeout: 480000, protocolTimeout: 480000 });
      const page = await browser.newPage();
      await page.goto('https://fortnite.gg/shop');
      //wait 10 second
      await page.waitForTimeout(5000);
      ggtext = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
    } catch (error) {
      const ggshop = await fetch('https://fortnite.gg/shop');
      ggtext = await ggshop.text();
    }
    const $ = cheerio.load(ggtext);
    for (let i = 0; i < fortniteitemshopjson.shop.length; i++) {
      if(fortniteitemshopjson.shop[i].displayType != 'Music' && fortniteitemshopjson.shop[i].mainType != 'bundle') {
        //find image that have alt text same as 'Fortnite Item Shop ' + fortniteitemshopjson.shop[i].displayName
        const img = $('img[alt="Fortnite Item Shop ' + fortniteitemshopjson.shop[i].displayName + '"]');
        //get src of img
        const imgsrc = img.attr('src');
        console.log(fortniteitemshopjson.shop[i].displayName);
        console.log(imgsrc);
        if (imgsrc) {
          fortniteitemshopjson.shop[i].video = 'https://fnggcdn.com' + imgsrc.replace('img/', '').replace('icon.png', 'video.mp4');
        } else {
          fortniteitemshopjson.shop[i].video = '';
        }
      } else {
        fortniteitemshopjson.shop[i].video = '';
      }
    }
    //write to file
    fs.writeFileSync('fortniteitemshop.json', JSON.stringify(fortniteitemshopjson));
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send(fortniteitemshopjson);
  } else {
    //read file
    const fortniteitemshopjson = JSON.parse(fs.readFileSync('fortniteitemshop.json'));
    //if now after 7am and exist file write before today 7am
    if (new Date().getHours() >= 7 && fs.statSync('fortniteitemshop.json').mtime < new Date().setHours(7, 0, 0, 0)) {
      const headers = {
        'Authorization': process.env.FORTNITE_API_IO_KEY
      }
      const fortniteitemshop = await fetch('https://fortniteapi.io/v2/shop?lang=th&includeRenderData=true', { 'headers': headers });
      const fortniteitemshopjson = await fortniteitemshop.json();
      const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--disable-extensions'], headless: "new", timeout: 300000, protocolTimeout: 300000 });
      const page = await browser.newPage();
      await page.goto('https://fortnite.gg/shop');
      //wait 10 second
      await page.waitForTimeout(7500);
      const ggtext = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      const $ = cheerio.load(ggtext);
      for (let i = 0; i < fortniteitemshopjson.shop.length; i++) {
        if(fortniteitemshopjson.shop[i].displayType != 'Music' && fortniteitemshopjson.shop[i].mainType != 'bundle') {
          //find image that have alt text same as 'Fortnite Item Shop ' + fortniteitemshopjson.shop[i].displayName
          const img = $('img[alt="Fortnite Item Shop ' + fortniteitemshopjson.shop[i].displayName + '"]');
          //get src of img
          const imgsrc = img.attr('src');
          console.log(fortniteitemshopjson.shop[i].displayName);
          console.log(imgsrc);
          if (imgsrc) {
            fortniteitemshopjson.shop[i].video = 'https://fnggcdn.com' + imgsrc.replace('img/', '').replace('icon.png', 'video.mp4');
          } else {
            fortniteitemshopjson.shop[i].video = '';
          }
        } else {
          fortniteitemshopjson.shop[i].video = '';
        }
      }
      //write to file
      fs.writeFileSync('fortniteitemshop.json', JSON.stringify(fortniteitemshopjson));
      reply.header('Access-Control-Allow-Origin', '*');
      return reply.send(fortniteitemshopjson);
    }
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send(fortniteitemshopjson);
  }
});

fastify.get('/odooleave', async (req, reply) => {
  // const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "args": [],
      "model": "calendar.event",
      "method": "search_read",
      "kwargs": {
        "context": {
          "lang": "en_US",
          "tz": "Asia/Bangkok",
          "uid": 23,
          "allowed_company_ids": [
            1
          ]
        },
        "domain": [
          [
            "start",
            "<=",
            "2025-12-31 16:59:59"
          ],
          [
            "stop",
            ">=",
            "2025-01-01 17:00:00"
          ]
        ],
        "fields": [
          "display_name",
          "start",
          "duration",
          "stop",
          "allday",
          "attendee_status",
          "partner_id",
          "partner_ids",
          "is_highlighted",
          "description"
        ]
      }
    },
    "id": 75041653
  });

  const requestOptions = {
    method: "POST",
    // headers: myHeaders,
    headers: {
      "Content-Type": "application/json",
      "Cookie": "session_id=e821ed249877f432516a5bbbb7ad4c6338f87139"
    },
    body: raw,
    redirect: "manual"
  };

  // fetch("http://157.230.255.67:8069/web/dataset/call_kw/calendar.event/search_read", requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));

  const fectodoo = await fetch("http://157.230.255.67:8069/web/dataset/call_kw/calendar.event/search_read", requestOptions);
  const fectodoojson = await fectodoo.json();

  // Helper to format date into YYYYMMDD
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  // Start building the ICS file
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Leave Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  fectodoojson.result.forEach(event => {
    const start = formatDate(event.start);
    const stop = new Date(event.stop);
    stop.setDate(stop.getDate() + 1); // to make end date exclusive
    const end = formatDate(stop.toISOString());

    icsContent += `BEGIN:VEVENT
UID:${event.id}@leavecalendar.local
DTSTAMP:${start}T000000Z
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
SUMMARY:${event.display_name}
DESCRIPTION:${event.description || ''}
TRANSP:TRANSPARENT
END:VEVENT
`;
  });

  icsContent += `END:VCALENDAR\n`;

  // Write to .ics file
  // fs.writeFileSync('leave-calendar.ics', icsContent);
  // console.log('ICS file created: leave-calendar.ics');

  reply.header('Access-Control-Allow-Origin', '*');
  // console.log(fectodoojson);
  // return reply.send(fectodoojson);

  reply.header('Content-Type', 'text/calendar');
  reply.header('Content-Disposition', 'attachment; filename=leave-calendar.ics');
  return reply.send(icsContent);
});

fastify.get('/twitcharchivevideo', async (req, reply) => {
  const twitchapitoken = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + process.env.TWITCH_CLIENT_ID + '&client_secret=' + process.env.TWITCH_CLIENT_SECRET + '&grant_type=client_credentials', { 'method': 'POST' });
  const twitchaccessjson = await twitchapitoken.json();
  const token = twitchaccessjson.access_token;
  const twitchapi = await fetch('https://api.twitch.tv/helix/videos?user_id=37876518&type=archive', { 'headers': { 'Client-ID': process.env.TWITCH_CLIENT_ID, 'Authorization': 'Bearer ' + token } });
  const twitchapijson = await twitchapi.json();
  console.log(twitchapijson);
  if (twitchapijson.data.length > 0) {
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send(twitchapijson.data);
  } else {
    reply.header('Access-Control-Allow-Origin', '*');
    return reply.send('offline');
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ host: '0.0.0.0', port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
