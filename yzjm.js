/**
 * 功能：椰子接码
 * 变量格式：export yzjm='账号&密码'  不支持多账号
 * cron： 10 10 * * *
 */

 const $ = new Env('椰子接码');
 const notify = $.isNode() ? require('./sendNotify') : '';


////////可修改的参数///////
 let project_id = 179655;//项目ID
 let loop = 1;//过滤已做 1过滤 2不过滤
 let operator = 4;//运营商 0默认 1中国移动 2中国联通 3中国电信 4实卡 5虚卡
 let phone_num= '';//指定号码  输入号码或号段前五位或省(例：四川)
 let scope_black = '';//排除号段  长度为3至7为位且支持多个，用逗号分离
 let number = 1;//运行次数
 let journal = 1;//获取验证码时日志 0无日志 1有日志
 let ua = 'okhttp/3.12.0';
 const Notify = 0; //0为关闭通知，1为打开通知,默认为0
 const debug = 0; //0为关闭调试，1为打开调试,默认为0
 //////////////////////

 let yzjm = process.env.yzjm;
 let yzjmArr = [];
 let smArr = [];
 let data = '';
 let msg = '';
 let back = 0;
 let username = '';
 let password = '';
 let token = '';
 let mobile = '';
 let code = '';
 let scriptVersion = "1.0.0";
// let token = process.env.yztoken;
 let project_type = 1;
 let num = 0;
 let smxm = '';
 let smsfz = '';

 !(async () => {
 
     if (!(await Envs()))
         return;
     else {
         console.log(`\n\n=========================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
             new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
             8 * 60 * 60 * 1000).toLocaleString()} \n=========================================\n`);

         await poem();
         console.log(`\n============ 当前版本：${scriptVersion}  最新版本：============`)
         console.log("\n=================== 本次共运行 "+number+" 次 ===================")
 
         if (debug) {
             console.log(`【debug】 这是你的全部账号数组:\n ${yzjmArr}`);
         }
 
         zhmm = yzjmArr[0].split('&');
         username =zhmm[0];
         password =zhmm[1];
         await method1();
         
         for (let index = 0; index < number; index++) {
             num = index + 1
             console.log(`\n========= 开始【第 ${num} 次运行】=========\n`)
 
             //console.log(yzjmArr[index]);
             qb = yzjmArr[0];
             if (debug) {
                 console.log(`\n 【debug】 这是你的账号信息:\n ${yzjmArr}\n`);
             }
     
             await $.wait(1 * 1000);
             await method2();
             back = 0;
             
         }
         
         await SendMsg(msg);
     }
 })()
     .catch((e) => console.logErr(e))
     .finally(() => $.done())
 





 /**
  * 通过账号密码获取token  
  */
 function method1(timeout = 3 * 1000) {
     return new Promise((resolve) => {
         let url = {
             url: `http://103.60.165.148:81/api/logins?username=${username}&password=${password}`,
             headers: { 
                "User-Agent": ua,
             },
         }
 
         if (debug) {
             console.log(`\n【debug】=============== 这是请求 url ===============`);
             console.log(JSON.stringify(url));
         }
 
         $.get(url, async (error, response, data) => {
             try {
                 if (debug) {
                     console.log(`\n\n【debug】===============这是返回data==============`);
                     console.log(data)
                 }

                 let result = JSON.parse(data);
               
                 //console.log(result)
              
                 if (result.message == "登录成功") {
 
                    token = result.token;
                   
                    console.log("【"+await time()+" 】"+result.message+"   🎉")
                    console.log("【"+await time()+" 】登录IP：" + result.data[0].ip);
                    console.log("【"+await time()+" 】账户余额："+result.data[0].money+ "  待释放余额："+result.data[0].money_1);
                    //console.log("账号token为："+result.token)
                 } else {  
                     console.log(`\n登录失败  ❌`)
                 }
             } catch (e) {
                 console.log(e)
             } finally {
                 resolve();
             }
         }, timeout)
     })
 }
 
 /**
  * 通过token获取账号余额 
  * 
  */
  function method2(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://103.60.165.148:81/api/get_myinfo?token=${token}`, 
            headers: { 
                "User-Agent": ua,
            }
        }

        if (debug) {
            console.log(`\n【debug】=============== 这是请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    console.log(`\n\n【debug】===============这是返回data==============`);
                    console.log(data)
                }
                let result = JSON.parse(data);
                if (result.message == "ok") {
                    console.log("【"+await time()+" 】登录成功   🎉")
                    console.log("【"+await time()+" 】账户余额："+result.data[0].money+ "  待释放余额："+result.data[0].money_1);
                    await method3();
               } else {  
                    console.log(`\n登录失败   ❌`)
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


/**
  * 获取号码
  */
  function method3(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://103.60.165.148:81/api/get_mobile?token=${token}&project_id=${project_id}&project_type=${project_type}&operator=${operator}&loop=${loop}&phone_num=${phone_num}&scope_black=${scope_black}`, 
            headers: { 
                "User-Agent": ua,
            },
        }
        if (debug) {
            console.log(`\n【debug】=============== 这是请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    console.log(`\n\n【debug】===============这是返回data==============`);
                    console.log(data)
                }

                let result = JSON.parse(data);
                console.log("【"+ await time() +" 】开始获取手机号")
              //console.log(result);
                if (result.message == "ok") {
                    console.log("【"+await time()+" 】获取成功   🎉")
                    console.log("【"+await time()+" 】获取的号码为：" + result.mobile);
                    console.log("【"+await time()+" 】运营商为：" + result.operator)
                    mobile = result.mobile;
                    msg += '第 '+num+' 次运行号码为：'+ result.mobile +'\n';
                    if(journal == 0) {
                        console.log("【"+await time()+" 】开始获取验证码   无日志")
                        await method4();
                    } else {  
                    await method4();
                    }
                } else {  
                    console.log("【"+await time()+" 】"+result.message+"  失败   ❌")
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


/**
  * 获取验证码
  */
  function method4(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://103.60.165.148:81/api/get_message?token=${token}&phone_num=${mobile}&project_id=${project_id}&project_type=${project_type}`, 
            headers: { 
                "User-Agent": ua,
            },
        }
        if (debug) {
            console.log(`\n【debug】=============== 这是请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    console.log(`\n\n【debug】===============这是返回data==============`);
                    console.log(data)
                }
                let result = JSON.parse(data);
                //console.log(result);
                back = back + 1;
                //30代表获取30次，3秒一次，正常应该为100次
                if(back <= 30) {
                    if(journal == 0) {
                        
                        await $.wait(3 * 1000);
                        if (result.message == "ok") {
                        //console.log(result);
                        console.log("【"+await time()+" 】获取验证码成功   🎉")
                        console.log("【"+await time()+" 】验证码为：" + result.code)
                          code = result.code;
                        await $.wait(1 * 1000);
                        //console.log("【"+await time()+" 】开始释放号码");
                        await method5();
                        } else {
                            await method4();
                        }
                    } else {
                        console.log("【"+await time()+" 】开始第 " +back+" 次获取：");
                        await $.wait(3 * 1000);
                        if (result.message == "ok") {
                     // console.log(result);
                        console.log("【"+await time()+" 】获取验证码成功   🎉")
                        console.log("【"+await time()+" 】验证码为：" + result.code)
                        code = result.code;
                        await $.wait(1 * 1000);
                        //console.log("【"+await time()+" 】开始释放号码");
                        await method5();
                        
                        } else {
                            console.log("【"+await time()+" 】" + result.message)
                            await method4();
                        }
                    }
                } else {
                    console.log("【"+await time()+" 】未获取到验证码，开始释放号码");
                    await method5();
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/**
  * 释放号码
  */
  function method5(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `http://103.60.165.148:81/api/free_mobile?token=${token}&phone_num=${mobile}&project_id=${project_id}&project_type=${project_type}`, 
            headers: { 
                "User-Agent": ua,
            },
        }
        if (debug) {
            console.log(`\n【debug】=============== 这是请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    console.log(`\n\n【debug】===============这是返回data==============`);
                    console.log(data)
                }
                let result = JSON.parse(data);
                //console.log(result);
                if (result.message == "ok") {
                    await $.wait(1 * 1000);
                    console.log("【"+await time()+" 】释放号码成功   🎉")
                    await method6();
                } else {  
                    console.log(`\n失败   ❌`)
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}



/**
  * 随机生成一个实名信息
  */
function method6(timeout = 3 * 1000) {
     return new Promise((resolve) => {
         let url = {
             url: `https://raw.githubusercontents.com/iwzzz/JavaScript/main/shiming01.txt`,
             headers: { 
                "User-Agent": ua,
             },
         }
         if (debug) {
             console.log(`\n【debug】=============== 这是请求 url ===============`);
             console.log(JSON.stringify(url));
         }

         $.get(url, async (error, response, data) => {
             try {
                 if (debug) {
                     console.log(`\n\n【debug】===============这是返回data==============`);
                     console.log(data)
                 }
                 //let result = JSON.parse(data);
                 if (data.indexOf("\n") != -1) {
                  data.split("\n").forEach((item) => {
                     smArr.push(item);
                     });
                 } else {
                     smArr.push(data);
                 }
                 let unm = randomInt(0, smArr.length-1);
                 console.log("【"+await time()+" 】开始随机生成一个实名信息")
                 //console.log(smArr[unm])
                 smxx = smArr[unm].split('----');
                 smxm =smxx[0];
                 smsfz =smxx[1];
                 console.log("【"+await time()+" 】" +smxm + "   " +smsfz);
                 msg += '第 '+num+' 次随机生成一个实名信息为：\n';
                 msg += smxm + "   " +smsfz +"\n\n";
             } catch (e) {
                 console.log(e)
             } finally {
                 resolve();
             }
         }, timeout)
     })
 }



 




/**
  * 判断参数
  */
function empty() {
    

   
}


/**
  * 获取时间
  */
function time(){
    return new Date(  new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleTimeString('chinese',{hour12:false})
}


 // ============================================变量检查============================================ \\
 async function Envs() {
     if (yzjm) {
         if (yzjm.indexOf("@") != -1) {
             yzjm.split("@").forEach((item) => {
                 yzjmArr.push(item);
             });
         } else {
             yzjmArr.push(yzjm);
         }
     } else {
         console.log(`\n 【${$.name}】：未填写变量 yzjm`)
         return;
     }
 
     return true;
 }
 
 // ============================================发送消息============================================ \\
 async function SendMsg(message) {
     if (!message)
         return;
 
     if (Notify > 0) {
         if ($.isNode()) {
             var notify = require('./sendNotify');
             await notify.sendNotify($.name, message);
             console.log("\n==============📣系统通知📣==============\n")
             console.log(message);
         } else {
             $.msg(message);
         }
     } else {
         console.log("\n==============📣系统通知📣==============\n")
         console.log(message);
     }
 }
 
 /**
  * 随机数生成
  */
 function randomString(e) {
     e = e || 32;
     var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
         a = t.length,
         n = "";
     for (i = 0; i < e; i++)
         n += t.charAt(Math.floor(Math.random() * a));
     return n
 }
 
 /**
  * 随机整数生成
  */
 function randomInt(min, max) {
     return Math.round(Math.random() * (max - min) + min)
 }

 /**
  * 获取毫秒时间戳
  */
 function timestampMs(){
    return new Date().getTime();
 }

 /**
  * 获取秒时间戳
  */
 function timestampS(){
    return Date.parse(new Date())/1000;
 }

/**
  * 获取随机诗词
  */
 function poem(timeout = 3 * 1000) {
   return new Promise((resolve) => {
     let url = {
       url: `https://v1.jinrishici.com/all.json`,
     };
     $.get(
       url,
       async (err, resp, data) => {
         try {
           data = JSON.parse(data);
           console.log(`${data.content}  \n————《${data.origin}》${data.author}`);
         } catch (e) {
           log(e, resp);
         } finally {
           resolve();
         }
       },
       timeout
     );
   });
 }





 function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t },(t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(ss.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s &&this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }