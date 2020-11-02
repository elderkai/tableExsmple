// 工具函数

/*
 *  处理该项目的数据
 *  @arr  待处理的数组
 *  @open 是否开启排名
 *  reutrn 结构化数据
 *
 */
function handle(arr, open) {

  if (!open) open = false;

  var datas = {}; // 处理完的结构对象
  var key = []; // 结构对象的对应表

  arr.forEach((e, i) => {

    if (i == 0) return;

    // 没有该机构
    if (!(e.manageType in datas)) {

      datas[e.manageType] = {
        n: 0
      };
      key.push({
        name: e.manageType,
        list: [],
        pn: []
      })

    }

    if (!datas[e.manageType][e.manageName]) {

      datas[e.manageType][e.manageName] = {
        tol: null,
        list: []
      }
      key.forEach(e1 => {
        if (e1.name == e.manageType) {

          e1.list.push(e.manageName);

          if (open) {
            e1.pn.push([e.anpTargetRate, e.manageName]);
          }

        }
      })

      datas[e.manageType][e.manageName].tol = e;

    } else {

      datas[e.manageType][e.manageName].list.push(e);

    }
    datas[e.manageType].n++;

  });
  // console.log(key)
  if (open) {
    key.map(function (e) {

      e.pn = e.pn.sort(function (a, b) {

        if (typeof a[0] != 'number') {
          return 1
        } else if (typeof b[0] != 'number') {
          return -1
        }

        if (a[0] - b[0] < 0) {
          return 1
        } else {
          return -1
        }
      })

      e.list = [];

      e.pn.forEach(function (e1, i) {
        e.list[i] = e1[1];
      })

      return e;
    })
  }

  return {
    datas: datas,
    key: key
  }

}

/*
 *  判断是否为pc端
 *  return Boolean
 */
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

/*
 * 解析请求参数
 * 传入请求体（object）
 * 输出query 请求格式 ?a=1*b=2
 */
function qs(obj) {
  let q = '';
  Object.keys(obj).forEach(k => {
    q += (k + '=' + obj[k] + '&');
  })
  return q.replace(/&$/, '');
}


/*
 *  滚动条事件
 *  @obj 拖拽方（滚动条）
 *  @target 被移动方（内容）
 *
 */
function startScroll(obj, target) {
  let targetAllW = target.children().eq(0).width();
  let targetW = target.width();

  let objAllW = obj.fadeIn().width();
  let objW = targetW / targetAllW * objAllW;

  // 设置滚动大小
  obj.children().eq(0).css({
    'width': objW + 'px'
  })

  obj.children().eq(0).on('mousedown', e => {
    let objL = e.clientX - obj.children().eq(0).css('left').replace('px', '') * 1;

    $('body').on('mousemove', e => {
      e.preventDefault();
      let moveL = e.clientX - objL;
      let contentL = moveL * targetAllW / objAllW;
      if (moveL < 0) {
        moveL = 0;
      } else if (moveL > objAllW - objW) {
        moveL = objAllW - objW;
        contentL = moveL * targetAllW / objAllW;
      }
      target.scrollLeft(contentL);
      obj.children().eq(0).css({
        'left': moveL + 'px'
      })
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    })
  })

  $('body').on('mouseup', e => {
    $('body').off('mousemove');
  })
}


/*
 * 格式金钱
 * @momey  金额
 * @type   保留小数 = 2
 * @start  单位 = 10000
 * return  number
 */
function fmoney(momey, type = 2, start = 10000) {
  if (momey !== 0 && !momey) { // 过滤了 null,undefind,NaN,'',false
    return '--';
  } else if (momey === 0) { // 过滤了 0
    return 0;
  }

  type = type > 0 && type <= 20 ? type : 2;

  momey = Math.round((momey / start) * Math.pow(10, type)) / Math.pow(10, type);

  momey = parseFloat((momey + "").replace(/[^\d\.-]/g, "")).toFixed(type) + "";
  var l = momey.split(".")[0].split("").reverse(),
    r = momey.split(".")[1];
  t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }

  return t.split("").reverse().join("") + "." + r;
}

/*
 * 格式化百分比
 * @num  小数
 * @type 保留小数 == 2
 */
function fnum(num, type) {
  if (num !== 0 && !num) {
    return '--';
  } else if (num == 0) {
    return 0;
  }

  type ? '' : type = 2;
  if (!isNaN(num) && !isNaN(parseFloat(num))) {
    return (num * 100).toFixed(type) + '%';
  }

  return ''

}

/*
 * 格式化日期
 * @date 日期 String 20190101(2019-1-1)
 */
function fdate(date) {
  let y = date.slice(0, 4);
  let m = date.slice(4, 6);
  let d = date.slice(6, 8);
  return y + '-' + m + "-" + d
}

/*
 * 格式化字段
 * @str 待格式字段
 */
function fn(str) {

  if (str !== 0 && !str) {
    return '--';
  }
  return str;

}

/*
 * 设置表头内容
 * @time 设置刷新时间值 为空时使用系统时间
 */
function setHead(time, open = true) {

  if (open) $('.head_title').text('招行员福2020年_' + $('.head_title').text())

  // 数据刷新时间：2019-12-14 18:08:55
  if (!time) {
    // 2019-11-25 16:50:32
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m1 = date.getMinutes();
    var s = date.getSeconds();
    $('.head_data').text('数据刷新时间：' + y + '-' + m + '-' + d + ' ' + h + ':' + m1 + ':' + s);
    return '';
  }
  $('.head_data').text('数据刷新时间：' + time);
}

/*
 * 加工数据
 * @data 待处理的数据 Array
 * @handle 特殊字段的处理方法  Object{字段名：Function, list: [{key: [],do:Function}] 集合处理}
 * @exportD 字段产出处理  Object{字段名：Function(v,e), list: [{key: [],do:Function}] 集合处理}
 */
function handleDate(data = [], handle = {}, exportD = {}) {

  let
    handleList = {},
    exportList = {},
    exportDate = {};

  handleDate.export = exportDate;

  // 默认处理 -> 集合处理 -> 特殊处理
  if (handle.list && handle.list instanceof Array) {

    handle.list.forEach(e => {
      e.key instanceof Array && e.key.forEach(k => {

        // 如果该字段的特殊处理不存在，加上集合处理,并且可以替代前面的集合处理
        if (!handle[k] && k != 'list') {
          if (e.do instanceof Function) handleList[k] = e.do;
        }

      })
    })

    handle = {
      ...handleList,
      ...handle
    };

  }

  if (exportD.list && exportD.list instanceof Array) {

    exportD.list.forEach(e => {
      e.key instanceof Array && e.key.forEach(k => {

        // 如果该字段的特殊处理不存在，加上集合处理,并且可以替代前面的集合处理
        if (!exportD[k] && k != 'list') {
          if (e.do instanceof Function) exportList[k] = e.do;
        }

      })
    })

    exportD = {
      ...exportList,
      ...exportD
    };
  }

  function _handleDate(data, handle) {

    if (data instanceof Array) {

      let datas = [];

      data.forEach((e, i) => {

        datas[i] = {};

        if (typeof e != 'object' || e === null) {
          datas[i] = fn(e);
          return;
        }

        Reflect.ownKeys(e).forEach(k => {

          // 基本类型的处理
          if (typeof e[k] != 'object' || e[k] === null) {

            // 产出处理
            if (exportD[k]) {
              exportD[k].call(exportDate, {
                k,
                v: e[k]
              });
            }

            // 非特殊处理字段
            if (!handle[k]) {

              datas[i][k] = fn(e[k]);

            } else {

              // 特殊处理 以及集合字段处理
              datas[i][k] = handle[k](e[k], e);

            }

          } else {

            if (e[k] instanceof Array) {
              datas[i][k] = _handleDate(e[k], handle);
            } else if (e[k] instanceof Object) {
              datas[i][k] = _handleDate([e[k]], handle)[0];
            }

          }

        })

      })

      return datas;

    } else {

      console.error('错误：handleDate函数 仅接受数组作为第一参数');
      return false;

    }

  }

  return _handleDate(data, handle);
}
