var cron = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

cron.schedule('10 9 * * *', async () => {
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
    const response = await fetch('http://192.168.31.210:5000/reto',{'method': 'GET'});
    thisdayislottery = await response.text();
    //if thisdayislottery is json then it is error
    if(thisdayislottery.length > 10){
        thisdayislottery = 'error'
    }
    console.log(thisdayislottery)
    //thisdayislottery = 'yes'
    if(thisdayislottery == 'yes'){
        //const rechit = await fetch('https://thai-lottery1.p.rapidapi.com/getchit', {'method': 'GET', 'headers': {'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com', 'x-rapidapi-key': process.env.RAPIDAPI_KEY}});
        const rechit = await fetch('http://192.168.31.210:5000/getchit',{'method': 'GET'});
        const rechitjson = await rechit.json();
        //add rechitjson json array to imagearray
        //imagearray = rechitjson
        //fetch https://lottsanook-chitai-production.up.railway.app/ai
        const responseai = await fetch('https://lottsanook-chitai-production.up.railway.app/ai');
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
                                "text": "1. "+responseaijson[0].key+"",
                                "weight": "bold",
                                "size": "3xl"
                              },
                              {
                                "type": "text",
                                "text": "2. "+responseaijson[1].key+"",
                                "size": "xxl"
                              },
                              {
                                "type": "text",
                                "text": "3. "+responseaijson[2].key+"",
                                "size": "xl"
                              },
                              {
                                "type": "text",
                                "text": "4. "+responseaijson[3].key+""
                              },
                              {
                                "type": "text",
                                "text": "5. "+responseaijson[4].key+""
                              }
                            ]
                          },
                          {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                              {
                                "type": "text",
                                "text": "6. "+responseaijson[5].key+""
                              },
                              {
                                "type": "text",
                                "text": "7. "+responseaijson[6].key+""
                              },
                              {
                                "type": "text",
                                "text": "8. "+responseaijson[7].key+""
                              },
                              {
                                "type": "text",
                                "text": "9. "+responseaijson[8].key+""
                              },
                              {
                                "type": "text",
                                "text": "10. "+responseaijson[9].key+""
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
                            "url": ""+rechitjson[0]+"",
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
                            "url": ""+rechitjson[1]+"",
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
                            "url": ""+rechitjson[2]+"",
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
        const responseline = await fetch('https://api.line.me/v2/bot/message/broadcast', {'method': 'POST', 'headers': {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.LINE_TOKEN}, 'body': raw});
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

console.log('cron starting');