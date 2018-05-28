$(document).ready(function() {
    		
			new Vue({
	        	el:'#form',
	        	data () {
					return {
				      provList : [],
				      cityList : [],
				      storeStore : [],
				      prov:'选择城市',
				      city : '选择区域',
				      store :'选择门店'
				    }
			    },
			    methods : {
				    getProv(event){
				    	// this.prov = '选择城市';
				    	this.city = '选择区域';
				    	this.store = '选择门店';
				    	this.provList = [];
				    	this.cityList = [];
				    	this.storeStore = [];
				    	let self = this;  
				    	$.post('/TrialTools/baodaoh5_city/productId/'+event.target.value).then(function(res){
				    		console.log(res.data);
				    		for(var i in res.data){
				    			self.provList = res.data[i];
				    			break;
				    		}
				    		// // self.createMark(self.NearbyShopList)
				    		// console.log(self.provList);
				    	});
				    },
				    getCity(event){
				    	this.city = '选择区域';
				    	this.store = '选择门店';
				    	this.cityList = [];
				    	this.storeStore = [];
				    	// $('.city').find('option')[0].prop('selectd',true)
			    		let self = this;
				    	for (var i in this.provList) {
		                    var obj = this.provList[i];
		                    if (obj.p == event.target.value) {
		                        self.cityList = obj.c;
		                        break;
		                    }
		                }
				    },
				    getStore(event){
				    	this.store = '选择门店';
				    	this.storeStore = [];
				    	let self = this;
				    	for (var i in this.cityList) {
		                    var obj = this.cityList[i];
		                    if (obj.n == event.target.value) {
		                        self.storeStore = obj.a;
		                        break;
		                    }
		                }
				    }
			    
        		},
        		watch : {
        			provList : function(){
        				this.getCity(event);
        				this.getStore(event);
        			},
        			cityList : function(){
        				this.getStore(event);
        			}
        		}
        		
			})


			var checkSubmitFlg = false;
    		$(function () {
            $("#fromsubmit").click(function () {
                $("#frmTrial").submit()
            });
            $("#frmTrial").submit(function () {
            		
                //获取值
                var model = {
                    "username": $("[name=username]").val(),
                    "mobile": $("[name=mobile]").val(),
                    //"selectProduct": $("[name=select-Product] option:selected").attr("value"),
                    "selectprov": $("[name=select-prov] option:selected").attr("value"),
                    "selectcity": $("[name=select-city] option:selected").attr("value"),
                    "selectdist": $("[name=select-dist] option:selected").attr("value"),
                    // "selectwenproduct": $("[name=select-wenproduct] option:selected").attr("value"),
                    "Source": sessionStorage.getItem("Source"),
                    "productId": $("[name=select-Product] option:selected").attr("value")
                }
                 function isnum(obj) { var reg = /^1[0-9]{10}$/; return reg.test(obj) }
                //检验

                if (model.username == "" || model.username == null) {
                    alert("请填写您的姓名");
                    return false
                }
                if (model.mobile == "" || model.mobile == null || isnum(model.mobile) == false) {
                    alert("请填写您的手机");
                    return false
                }

                if (model.productId == "" || model.productId == null) {
                    alert("请选择您的产品");
                    return false
                }

                if (model.selectprov == "" || model.selectprov == null) {
                    alert("请选择您所在的城市");
                    return false
                }
                if (model.selectcity == "" || model.selectcity == null) {
                    alert("请选择您所在的区域");
                    return false
                }

                if (model.selectdist == "" || model.selectdist == null) {
                    alert("请选择门店");
                    return false
                }
                // if (model.selectwenproduct == "" || model.selectwenproduct == null) {
                //     alert("请选择您最常用的隐形眼镜品牌");
                //     return false
                // }
                //没有勾选协议结束
                if (!$('#checkbox_check1').is(':checked')) {
                    alert("请同意并授权相关信息，完成体验申请！");
                    return false
                }
                if (!$('#checkbox_check2').is(':checked')) {
                    alert("请同意并授权相关信息，完成体验申请！");
                    return false
                }

                //检测重复提交
                if (!checkSubmitFlg) {
                    // 第一次提交
                    checkSubmitFlg = true;

                } else {
                    return false;
                }
                PutData(model);
                return false;

            });


            function PutData(model) {

                $.ajax({
                    type: "post",
                    cache: false,
                    url: "/TrialTools/TrialPublic7",
                    async: false,
                    data: {
                        method: "TrialPC7",
                        UserName: model.username,
                        mobile: model.mobile,
                        product: model.productId,
                        ka_outlet_code: model.selectdist,
                        Source: model.Source
                    },
                    success: function (data) {
                        // data = JSON.parse(data);
                        
                        if (data.status == "1") {
                            alert(data.msg);
                            window.location.href='application.html?state='+sessionStorage.getItem('Source'); 
                            // window.location.href = "four.html?Source=" + sessionStorage.getItem("Source");
                        } else {
                            alert(data.msg);
                            // 第一次提交
                            checkSubmitFlg = false;
                            window.location.href='application.html?state='+sessionStorage.getItem('Source'); 
//                            if (data.msg == "您已参与过本活动，请注意查收活动短信") {
                                // window.location.href = "four.html?Source=" + sessionStorage.getItem("Source");
//                            }
                        }
                    },
                    error: function (error) {
                        alert("网络繁忙");
                    }
                });
            }
        })

    	});