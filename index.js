var cron = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var request = require('request');
var fs = require('fs');
const fastify = require('fastify')({ logger: true });
const Rcon = require('rcon-client').Rcon;

const options = {
  host: '192.168.31.220',
  port: 25575,
  password: 'minecraft'
};

const rcon = new Rcon(options);

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
  if (thisdayislottery == 'yes') {
    //const rechit = await fetch('https://thai-lottery1.p.rapidapi.com/getchit', {'method': 'GET', 'headers': {'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com', 'x-rapidapi-key': process.env.RAPIDAPI_KEY}});
    const rechit = await fetch('http://192.168.31.210:5000/getchit');
    const rechitjson = await rechit.json();
    //add rechitjson json array to imagearray
    //imagearray = rechitjson
    //fetch https://lottsanook-chitai-production.up.railway.app/ai
    const responseai = await fetch('https://lottsanook-chitai.vercel.app/ai');
    const responseaijson = await responseai.json();
    //raw body
    var raw = JSON.stringify({
      "messages": [
        {
          "type": "flex",
          "altText": "เลขเด็ดงวดนี้",
          "contents": {
            "type": "carousel",
            "contents": [
              {
                "type": "bubble",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "10 อันดับเลขดังจาก จะถูกไหมนะ AI",
                      "align": "center",
                      "weight": "bold"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "1. " + responseaijson[0].key + "",
                          "weight": "bold",
                          "size": "3xl"
                        },
                        {
                          "type": "text",
                          "text": "2. " + responseaijson[1].key + "",
                          "size": "xxl"
                        },
                        {
                          "type": "text",
                          "text": "3. " + responseaijson[2].key + "",
                          "size": "xl"
                        },
                        {
                          "type": "text",
                          "text": "4. " + responseaijson[3].key + ""
                        },
                        {
                          "type": "text",
                          "text": "5. " + responseaijson[4].key + ""
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "6. " + responseaijson[5].key + ""
                        },
                        {
                          "type": "text",
                          "text": "7. " + responseaijson[6].key + ""
                        },
                        {
                          "type": "text",
                          "text": "8. " + responseaijson[7].key + ""
                        },
                        {
                          "type": "text",
                          "text": "9. " + responseaijson[8].key + ""
                        },
                        {
                          "type": "text",
                          "text": "10. " + responseaijson[9].key + ""
                        }
                      ]
                    }
                  ],
                  "paddingBottom": "none"
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "uri",
                            "label": "ดูเลขเด็ดเพิ่มเติม",
                            "uri": "https://lottsanook-chitai-production.up.railway.app/"
                          }
                        }
                      ],
                      "backgroundColor": "#FFD700",
                      "cornerRadius": "xxl",
                      "background": {
                        "type": "linearGradient",
                        "angle": "0deg",
                        "startColor": "#FFD700",
                        "endColor": "#ffffff"
                      }
                    }
                  ]
                },
                "styles": {
                  "body": {
                    "separator": true
                  }
                }
              },
              {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "image",
                      "url": "" + rechitjson[0] + "",
                      "size": "full"
                    }
                  ],
                  "paddingAll": "none"
                }
              },
              {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "image",
                      "url": "" + rechitjson[1] + "",
                      "size": "full"
                    }
                  ],
                  "paddingAll": "none"
                }
              },
              {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "image",
                      "url": "" + rechitjson[2] + "",
                      "size": "full"
                    }
                  ],
                  "paddingAll": "none"
                }
              }
            ]
          }
        }
      ]
    });
    //post to https://api.line.me/v2/bot/message/broadcast
    const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
    const responselinejson = await responseline.json();
    console.log(responselinejson);
  }
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
    } else if(responsejson[0][1] == '0' || responsejson[0][1] == 0){
      //remove last.txt file
      fs.unlinkSync('./last.txt');
    }
    if ((parseInt(responsejson[8][1]) != 0 || parseInt(responsejson[7][1]) != 0 || parseInt(responsejson[6][1]) != 0) && (responsejson[8][1].toUpperCase() != "XXXXXX" || responsejson[7][1].toUpperCase() != "XXXXXX" || responsejson[6][1].toUpperCase() != "XXXXXX") && today.getHours() < 15) {
      const youtubeapi = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&channelId=UC0xykk-LCkhdxjFl2gdMkkQ&order=date&key=' + process.env.YOUTUBE_API_KEY);
      const youtubeapijson = await youtubeapi.json();
      if (youtubeapijson.pageInfo.totalResults > 0) {
        if (youtubeapijson.items[0].snippet.liveBroadcastContent == 'live') {
          var youtubeimage = youtubeapijson.items[0].snippet.thumbnails.medium.url || youtubeapijson.items[0].snippet.thumbnails.default.url;
          
          var raw = {
            "type": "bubble",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://www.youtube.com/watch?v="+youtubeapijson.items[0].id.videoId
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

          if(fs.existsSync('./last.txt') == false) {
            const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', { 'method': 'POST', 'headers': { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN }, 'body': raw });
            const responselinejson = await responseline.json();
            console.log(responselinejson);
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
  if(todaytext == 'yes'){
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
    'url': 'https://graph.facebook.com/v8.0/'+pageid+'/photos?access_token='+pageaccesstoken+'&message='+pagemsgdecode,
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

fastify.get('/gettempbyopenai', async (req, reply) => {
  const roomtemp = req.query.roomtemp;
  const aircontempset = req.query.aircontempset;
  const outsidetemp = req.query.outsidetemp;
  const whattempwant = req.query.whattempwant;
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "If the room temperature is "+roomtemp+"°C and the air conditioning is set at "+aircontempset+"°C while the outside temperature is "+outsidetemp+", what temperature should the air conditioning be set to in order to achieve a room temperature of "+whattempwant+"°C? (answer only number)",
    temperature: 1,
    max_tokens: 150,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0.6,
  });
  reply.header('Access-Control-Allow-Origin', '*');
  return reply.send(response.data.choices[0].text);
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
