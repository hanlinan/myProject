

    var Latitude = 31.230416;//纬度
    var Longitude = 121.473701;//经度

    var store_values = null;//全局的门店数据
    //var store_values_xiala = null;//全局的门店数据





    //打开
    function OpenLocation(Latitude, Longitude, StoreName, Addr) {
        wx.openLocation({
            latitude: Latitude, // 纬度，浮点数，范围为90 ~ -90
            longitude: Longitude, // 经度，浮点数，范围为180 ~ -180。
            name: StoreName, // 位置名
            address: Addr, // 地址详情说明
            scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }

    $(function () {
        //加载城市 绑定事件
        $("#Citylist").change(function () {
            $("#Arealist").html("<option>区</option>");
            //加载区域
            if ($("#Citylist").val()) {
                $.ajax({
                    type: "post",
                    url: "GetArea",
                    data: { Area: $("#Citylist").val() },
                    cache: false,
                    async: false,
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        $(data.AreaList).each(function (index, item) {
                            $("#Arealist").append("<option value='" + item + "'>" + item + "</option>");
                        })
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("请求失败！");
                    }
                });
            }
        });

        $("#Arealist").change(function () {
            $("#kalist").val("所有眼镜店")
            if ($("#Arealist").val() == '区') {
                $("#kalist").val("所有眼镜店");
                $("#KaSearch").val("");
                return;
            }
            key = $("#Arealist").val();
           
            GetNearbyStoresArea(key, function (store_values_temp) {
                store_values = store_values_temp;
                load_sis_map(store_values_temp, '');
                $("#storelist").html("");
                LoadStore();
            });
        });


        $("#DownPage").click(function () {
            LoadStore()
        });


        $("#kalist").change(function () {
            $("#KaSearch").val("");
            KaKey = $(this).val();

            if (KaKey == "GrandVision观视界") {
                KaKey = "观视界"
            }

            //KaKey = KaKey == "所有眼镜店" ? "" : KaKey
            if (KaKey == "所有眼镜店") {
                $("#storelist").html("");
                LoadStore();
            } else {
                var t = []
                $(store_values).each(function (index, item) {

                    if (item.StoreName.indexOf(KaKey) != -1) {
                        t.push(item)
                    }

                });
                $("#storelist").html("");
                load_sis_map(t, '');
                LoadStore(t);
            }


            //GetNearbyStores(Latitude, Longitude, KaKey, function (store_values_temp) {
            //    ClearStore();
            //    store_values = store_values_temp;
            //    load_sis_map('');
            //    LoadStore();
            //})
        });
        //文本搜索
        $("#KaSearchSubmit").click(function () {
            $("#kalist").val("所有眼镜店")
            KaSearch = $("#KaSearch").val();
            if (KaSearch != '') {
                var t = []
                $(store_values).each(function (index, item) {

                    if (item.StoreName.indexOf(KaSearch) != -1) {
                        t.push(item)
                    }

                });
                $("#storelist").html("");
                load_sis_map(t, '');
                LoadStore(t);
            } else {
                $("#storelist").html("");
                LoadStore();
            }
        });


    });




    //页面加载
    wx.ready(function () {
        wx.getLocation({
            success: function (res) {
                Latitude = res.latitude;
                Longitude = res.longitude;
                var ggPoint = new BMap.Point(Longitude, Latitude);
                setTimeout(function () {
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(ggPoint);
                    convertor.translate(pointArr, 1, 5, function (data) {
                        Longitude = data.points[0].lng
                        Latitude = data.points[0].lat
                        GetNearbyStores(Latitude, Longitude, function (store_values_temp) {
                            store_values = store_values_temp;
                            load_sis_map(store_values_temp, '');
                            LoadStore(store_values_temp);
                        });
                    })
                }, 1000);

            }
        })
    });




    //根据坐标加载数据
    function GetNearbyStores(Longitude, Latitude, back) {
        $.ajax({
            type: "post",
            url: "NearbyShop",
            data: { Longitude: Longitude, Latitude: Latitude },
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                if (data.state == 0) {
                    back(data.NearbyShopList);
                } else {
                    ErrorWarning('网络异常');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败！");
            }
        });
    }

    //根据城市加载数据
    function GetNearbyStoresArea(Area, back) {
        var url = "GetCityAndArea";
        $.ajax({
            type: "post",
            url: url,
            data: { Area: Area },
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                if (data.state == 0) {
                    back(data.NearbyShopList);
                } else {
                    ErrorWarning('网络异常');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败！");
            }
        });
    }

    //地图加载数据
    function load_sis_map(store_values, StoreId) {
        map = new BMap.Map("map_canvas");
        CurrentLocation(map)
        if (store_values.length > 0) {
            map.centerAndZoom(new BMap.Point(store_values[0].Longitude, store_values[0].Latitude), 14);
            map.addControl(new BMap.NavigationControl());// Map panning and zooming controls
            map.addControl(new BMap.ScaleControl()); // Scale control
            map.addEventListener("click", showInfo);
            for (var i = 0; i < store_values.length; i++) {
                storeCounter = i;
                if (store_values[i].Latitude != 0 && store_values[i].Latitude != '' && store_values[i].Longitude != 0 && store_values[i].Longitude != '') {
                    var imgname = GetMapImg(store_values[i].StoreRank)
                    var icon = new BMap.Icon('/Content/images/dot.png', new BMap.Size(61, 61), {
                        anchor: new BMap.Size(40, 60),
                        infoWindowAnchor: new BMap.Size(40, 0)
                    });
                    var marker = new BMap.Marker(new BMap.Point(store_values[i].Longitude, store_values[i].Latitude), { icon: icon });
                    //console.log(store_values[i]);
                    var content = convertHtml(store_values[i]);
                    map.addOverlay(marker);
                    var infoWindow = new BMap.InfoWindow(content);
                    if (store_values[i].StoreId == StoreId) {
                        marker.openInfoWindow(infoWindow);
                        map.centerAndZoom(new BMap.Point(store_values[i].Longitude, store_values[i].Latitude), 14);
                    }

                    var store_name = store_values[i].StoreId;
                    addClickHandler(store_name, marker);
                }
            }
        } else {
            //var Latitude = 31.230416;//纬度
            //var Longitude = 121.473701;//经度
            map.centerAndZoom(new BMap.Point(Longitude, Latitude), 15);
            map.addControl(new BMap.NavigationControl());// Map panning and zooming controls
            map.addControl(new BMap.ScaleControl()); // Scale control
            map.addEventListener("click", showInfo);
        }
    }

    currentstoreid = '';
    function showInfo(e) {
        KaSearch = $("#KaSearch").val();
        var t = []
        if (KaSearch != '') {

            $(store_values).each(function (index, item) {

                if (item.StoreName.indexOf(KaSearch) != -1) {
                    t.push(item)
                }

            });

        } else {
            t = store_values;
        }


        $("#kalist").val("所有眼镜店")
        //选择了门店
        if (currentstoreid != '') {
            load_sis_map(t, currentstoreid);//显示选择的门店
            currentstoreid = '';
        }
        else {
            ClearStore()
            Latitude = e.point.lat;
            Longitude = e.point.lng;
            //刷新数据
            GetNearbyStores(Latitude, Longitude, function (store_values_temp) {
                ClearStore();
                store_values = store_values_temp;
                //显示附件门店
                load_sis_map(store_values, '');
                LoadStore(store_values_temp);
            })
        }

    }

    function ClearStore() {
        $("#storelist").html("");
        $("#Citylist").val("市");
        $("#Arealist").html("<option>区</option>");
        $("#KaSearch").html("");
    }

    //var mydata = null

    function LoadStore(data) {

        if (data != null) {
            mydata = data;
        } else {
            mydata = store_values;
        }
        //console.log(mydata);
        if ($("#storelist div").length == 0) {
            $(mydata).each(function (index, item) {
                $("#DownPage").show();
                var model = mydata[index];
                //store_values.splice(model, 1)
                var html = '';
                if (index <= 5) {
                    html = " <div class='" + GetImg(model.StoreRank) + "' onclick='OpenLocation(" + model.Latitude + "," + model.Longitude + ",\"" + model.StoreName + "\",\"" + model.Addr + "\")'><span class='map-one-span'>" + model.StoreName + "</span><br>" + model.Addr + "<br>电话：" + model.TelD2 + "<img src='/Content/images/dot.jpg' class='map-dot'></div>";

                } else {
                    html = " <div style='display: none;' class='" + GetImg(model.StoreRank) + "' onclick='OpenLocation(" + model.Latitude + "," + model.Longitude + ",\"" + model.StoreName + "\",\"" + model.Addr + "\")'><span class='map-one-span'>" + model.StoreName + "</span><br>" + model.Addr + "<br>电话：" + model.TelD2 + "<img src='/Content/images/dot.jpg' class='map-dot'></div>";
                }
                //console.log(model);
                $("#storelist").append(html);

            });
        } else {
            var hidddiv = $("#storelist div:hidden")
            var pagsize = 5;
            if (hidddiv.length > pagsize || hidddiv.length > 0) {
                $("#DownPage").show();
            } else {
                $("#DownPage").hide();
            }
            for (var i = 0; i < 5; i++) {
                if (hidddiv.length > 0) {
                    var model = hidddiv[0];
                    //store_values.splice(model, 1)
                    //var html = " <div class='" + GetImg(model.StoreRank) + "' onclick='OpenLocation(" + model.Latitude + "," + model.Longitude + ",\"" + model.StoreName + "\",\"" + model.Addr + "\")'><span class='map-one-span'>" + model.StoreName + "</span><br>" + model.Addr + "<br>电话：" + model.TelD2 + "<img src='/Content/images/dot.jpg' class='map-dot'></div>";
                    $(hidddiv).show();
                }
            }
        }


    }




    $(function () {
        var ggPoint = new BMap.Point(Longitude, Latitude);
        setTimeout(function () {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 1, 5, function (data) {
                Longitude = data.points[0].lng
                Latitude = data.points[0].lat
                //console.log(data);
                GetNearbyStores(Latitude, Longitude, function (store_values_temp) {
                    store_values = store_values_temp;
                    load_sis_map(store_values_temp, '');
                    LoadStore(store_values_temp);
                });
            })
        }, 1000);
    })






    // 小图转换
    function GetImg(StoreRank) {
        //console.log(StoreRank);
        switch (StoreRank) {
            case 1: return "map-one-1";
            case 2: return "map-one-3";
            case 3: return "map-one-2";
        }
    }
    //地图转换
    function GetMapImg(StoreRank) {
        switch (StoreRank) {
            case 1: return "dot1.png";
            case 2: return "dot3.png";
            case 3: return "dot2.png";
        }
    }

    function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
            currentstoreid = content;
        });
    };

    function convertHtml(values) {

        html = " <div class=‘store-details‘><p class=‘map_address‘ align=‘left‘><span style=‘color:#000000‘><strong>" + values.StoreName
            + "</strong></span></p><div class=‘image-address-wrapper‘><div class=‘store-details-list‘><p align=‘left‘><span style=‘color:#000000‘>地址: " + values.Addr
            + "</span></p><p align=‘left‘><span style=‘color:#76A2C5‘>电话号码: " + values.TelD2 + "</span></p></div></div></div>";
        //console.log(html);
        return html
    }

    function CurrentLocation(map) {
        var icon = new BMap.Icon('/Content/images/dot-r.png', new BMap.Size(61, 61), {
            anchor: new BMap.Size(40, 60),
            infoWindowAnchor: new BMap.Size(40, 0)
        });
        var marker = new BMap.Marker(new BMap.Point(Longitude, Latitude), { icon: icon });
        map.addOverlay(marker);
    }

