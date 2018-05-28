wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareAppMessage({

            title: '天才暖男作家—-张皓宸已上线', // 分享标题
            desc: '3月17日杭州西湖银泰，张皓宸等你来哦！更有白色情人节大礼包飞向你！还在等什么呢？', // 分享描述
            link: 'http://myacuvuewechat.51i.cc/WebActivity/bd0308/bdbwechat106.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://chongeye.oss-cn-hangzhou.aliyuncs.com/bd0306.jpg',
            success: function () {
                
                _hmt.push(['_trackEvent', '分享给朋友', '点击', Request.state , '' ]);
                    
            },
            cancel: function () {
            }

        });
        wx.onMenuShareTimeline({
            title: '天才暖男作家—-张皓宸已上线', // 分享标题
            link: 'http://myacuvuewechat.51i.cc/WebActivity/bd0308/bdbwechat106.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          	//imgUrl: 'http://ww2.sinaimg.cn/large/0060lm7Tly1fmrwmfg72pj30ku0d7762.jpg', // 分享图标
            imgUrl: 'http://chongeye.oss-cn-hangzhou.aliyuncs.com/bd0306.jpg', // 分享图标
            success: function () {
                
                _hmt.push(['_trackEvent', '分享朋友圈', '点击', Request.state , '' ]);
                
            },
            cancel: function () {
            }
        });
})