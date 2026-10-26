/* 红军长征路线图 —— 交互逻辑
 * 数据保存在浏览器 localStorage，可在手机上直接编辑。
 */
(function () {
  "use strict";

  var LS_KEY = "longmarch_map_v2";
  var SVGNS = "http://www.w3.org/2000/svg";
  var W = 1000, H = 780; // viewBox 尺寸

  /* ---------------- 默认数据 ---------------- */
  var DEFAULT_DATA = {
    title: "红军长征路线图",
    sub: "1934.10 — 1936.10 · 中央红军（红一方面军）长征主要节点",
    events: [
      { id: "e01", order: 1,  name: "瑞金",       date: "1931.11—1934.10", lon: 116.03, lat: 25.89, major: false,
        desc: "江西瑞金是中华苏维埃共和国临时中央政府所在地，中央苏区的红色首都。1931年11月，中华苏维埃第一次全国代表大会在此召开。第五次反“围剿”失利后，中共中央和中央红军从这里出发，踏上战略转移的征途。" },
      { id: "e02", order: 2,  name: "于都·长征出发", date: "1934年10月17日—20日", lon: 115.42, lat: 25.95, major: true,
        desc: "1934年10月，中央红军主力8.6万余人集结于江西于都河畔，分八个渡口夜渡于都河，开始举世闻名的二万五千里长征。于都河因此被称为“长征第一渡”。" },
      { id: "e03", order: 3,  name: "湘江战役",   date: "1934年11月27日—12月1日", lon: 110.67, lat: 25.61, major: true,
        desc: "红军在广西兴安、全州一带强渡湘江，突破国民党军第四道封锁线。此役是长征中最惨烈的一战，中央红军由出发时的8.6万余人锐减至3万余人。当地百姓流传着“三年不饮湘江水，十年不食湘江鱼”。" },
      { id: "e04", order: 4,  name: "遵义会议",   date: "1935年1月15日—17日", lon: 106.93, lat: 27.70, major: true,
        desc: "中共中央政治局在贵州遵义召开扩大会议，结束了“左”倾教条主义在中央的统治，开始确立毛泽东在党中央和红军的领导地位，在最危急关头挽救了党、挽救了红军、挽救了中国革命，是党的历史上生死攸关的转折点。" },
      { id: "e05", order: 5,  name: "四渡赤水",   date: "1935年1月—3月", lon: 105.90, lat: 28.40, major: false,
        desc: "毛泽东指挥中央红军在川黔滇边境的赤水河两岸来回穿插，先后四次东渡赤水，声东击西、忽南忽北，把几十万国民党军甩在乌江以北。四渡赤水被毛泽东称为自己军事生涯的“得意之笔”。" },
      { id: "e06", order: 6,  name: "巧渡金沙江", date: "1935年5月3日—9日", lon: 102.35, lat: 26.30, major: false,
        desc: "红军在云南禄劝皎平渡找到七只木船，经七天七夜将2万余人全部渡过金沙江，未掉一人一马，彻底跳出数十万国民党军的围追堵截，取得战略转移中具有决定意义的胜利。" },
      { id: "e07", order: 7,  name: "强渡大渡河·飞夺泸定桥", date: "1935年5月25日—29日", lon: 102.23, lat: 29.91, major: true,
        desc: "5月25日，红一团17名勇士在安顺场强渡大渡河。5月29日，红四团一昼夜急行240里，22名勇士攀着十三根铁索飞夺泸定桥，粉碎了蒋介石让红军成为“石达开第二”的图谋。" },
      { id: "e08", order: 8,  name: "翻越夹金山·懋功会师", date: "1935年6月", lon: 102.55, lat: 30.88, major: false,
        desc: "中央红军翻越长征途中第一座大雪山——海拔4114米的夹金山。6月12日，红一、红四方面军先头部队在达维会师，随后在懋功（今四川小金）庆祝会师，全军振奋。" },
      { id: "e09", order: 9,  name: "过草地",     date: "1935年8月", lon: 103.20, lat: 33.60, major: false,
        desc: "红军穿越纵横数百里的松潘大草地（今四川若尔盖一带）。草地泥潭遍布、气候恶劣，粮食断绝，红军指战员以草根、皮带充饥，用约七天时间走出了这片“死亡之海”，付出了巨大牺牲。" },
      { id: "e10", order: 10, name: "激战腊子口", date: "1935年9月16日—17日", lon: 103.90, lat: 34.10, major: false,
        desc: "红军在甘肃迭部强攻天险腊子口。隘口宽仅30余米，两侧悬崖峭壁。红军正面强攻与侧后攀崖迂回相结合，一举突破，打开了北上进入陕甘的通道。" },
      { id: "e11", order: 11, name: "会宁会师",   date: "1936年10月9日", lon: 105.05, lat: 35.69, major: true,
        desc: "1936年10月，红一、红二、红四方面军在甘肃会宁和静宁将台堡胜利会师。三大主力会师标志着历时两年的红军长征胜利结束，中国革命转危为安。" },
      { id: "e12", order: 12, name: "吴起镇·到达陕北", date: "1935年10月19日", lon: 108.18, lat: 36.93, major: true,
        desc: "中央红军（陕甘支队）抵达陕北吴起镇，与陕北红军会合，红一方面军历时一年、纵横十一个省的长征胜利结束。10月22日，中央政治局在吴起镇召开会议，宣告长征结束，开辟了中国革命的新局面。" }
    ]
  };

  /* 少量省份名称标注（经纬度大致位置，仅作地理参考） */
  var GEO_LABELS = [
    ["黑龙江", 127.6, 47.6], ["吉林", 126.4, 43.6], ["辽宁", 122.6, 41.2],
    ["内蒙古", 112.5, 42.5], ["北京", 116.4, 40.1], ["河北", 115.4, 38.4],
    ["山西", 112.3, 37.5], ["山东", 118.0, 36.3], ["河南", 113.7, 33.9],
    ["陕西", 109.0, 34.6], ["宁夏", 106.2, 37.4], ["甘肃", 101.6, 37.8],
    ["青海", 96.2, 35.3], ["新疆", 85.0, 41.8], ["西藏", 88.5, 31.2],
    ["四川", 101.2, 29.6], ["湖北", 112.3, 31.0], ["湖南", 111.6, 27.3],
    ["江西", 116.3, 27.4], ["福建", 118.1, 26.4], ["广东", 113.5, 23.4],
    ["广西", 108.9, 24.2], ["贵州", 106.2, 26.4], ["云南", 101.6, 24.6],
    ["海南", 109.8, 19.2], ["台湾", 121.0, 23.7]
  ];

  /* ---------------- 数据存取 ---------------- */
  function loadData() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && Array.isArray(d.events)) return d;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  function saveData() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
  }
  var data = loadData();
  var editMode = false;

  /* ---------------- 投影（墨卡托） ---------------- */
  var LON_MIN = 71, LON_MAX = 136, LAT_MIN = 17, LAT_MAX = 54.8, PAD = 26;
  function mercX(lon) { return lon * Math.PI / 180; }
  function mercY(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)); }
  var px0 = mercX(LON_MIN), px1 = mercX(LON_MAX);
  var py0 = mercY(LAT_MIN), py1 = mercY(LAT_MAX);
  var FIT = Math.min((W - PAD * 2) / (px1 - px0), (H - PAD * 2) / (py1 - py0));
  var OX = (W - (px1 - px0) * FIT) / 2, OY = (H - (py1 - py0) * FIT) / 2;
  function toXY(lon, lat) {
    return { x: OX + (mercX(lon) - px0) * FIT, y: OY + (py1 - mercY(lat)) * FIT };
  }
  function toLonLat(x, y) {
    var lon = ((x - OX) / FIT + px0) * 180 / Math.PI;
    var my = py1 - (y - OY) / FIT;
    var lat = (2 * Math.atan(Math.exp(my)) - Math.PI / 2) * 180 / Math.PI;
    return { lon: Math.round(lon * 100) / 100, lat: Math.round(lat * 100) / 100 };
  }

  /* ---------------- 视图变换（缩放/平移） ---------------- */
  var view = { k: 1, tx: 0, ty: 0 };
  var svg, vp, gMap, gLabels, gRoute, gStars;

  function applyView() {
    vp.setAttribute("transform", "translate(" + view.tx + "," + view.ty + ") scale(" + view.k + ")");
  }
  function clampView() {
    view.k = Math.max(1, Math.min(8, view.k));
    if (view.k === 1) { view.tx = 0; view.ty = 0; }
  }
  function animateView(target, dur) {
    dur = dur || 450;
    var s = { k: view.k, tx: view.tx, ty: view.ty }, t0 = performance.now();
    function step(t) {
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      view.k = s.k + (target.k - s.k) * e;
      view.tx = s.tx + (target.tx - s.tx) * e;
      view.ty = s.ty + (target.ty - s.ty) * e;
      applyView();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function zoomAt(cx, cy, factor) {
    var k2 = Math.max(1, Math.min(8, view.k * factor));
    view.tx = cx - (cx - view.tx) * (k2 / view.k);
    view.ty = cy - (cy - view.ty) * (k2 / view.k);
    view.k = k2; clampView(); applyView();
  }
  function resetView() { animateView({ k: 1, tx: 0, ty: 0 }); }
  function focusEvent(ev) {
    var p = toXY(ev.lon, ev.lat);
    var k = Math.max(view.k, 3.2);
    animateView({ k: k, tx: W / 2 - p.x * k, ty: H / 2.6 - p.y * k });
  }

  function svgPoint(clientX, clientY) {
    var pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    var p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }
  function worldPoint(clientX, clientY) {
    var p = svgPoint(clientX, clientY);
    return { x: (p.x - view.tx) / view.k, y: (p.y - view.ty) / view.k };
  }

  /* ---------------- 绘制 ---------------- */
  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function starPath(cx, cy, R) {
    var r = R * 0.382, pts = [];
    for (var i = 0; i < 10; i++) {
      var ang = -Math.PI / 2 + i * Math.PI / 5;
      var rad = i % 2 === 0 ? R : r;
      pts.push((cx + rad * Math.cos(ang)).toFixed(1) + "," + (cy + rad * Math.sin(ang)).toFixed(1));
    }
    return "M" + pts.join("L") + "Z";
  }
  function sortedEvents() {
    return data.events.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }

  function drawMap() {
    gMap.textContent = "";
    if (!window.CHINA_GEO) return;
    window.CHINA_GEO.forEach(function (f) {
      var d = "";
      f.polys.forEach(function (poly) {
        poly.forEach(function (ring) {
          ring.forEach(function (c, i) {
            var p = toXY(c[0], c[1]);
            d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
          });
          d += "Z";
        });
      });
      el("path", { d: d, "class": "province", "fill-rule": "evenodd" }, gMap);
    });
    /* 南海诸岛示意框 */
    var box = el("g", { "class": "scs" }, gMap);
    el("rect", { x: W - 118, y: H - 132, width: 96, height: 108, "class": "scs-box" }, box);
    var dash = "M" + (W - 102) + "," + (H - 112) + " q20,-4 30,10 q8,14 -6,26 q10,4 6,18 q-4,16 -22,18 q-16,2 -24,-8";
    el("path", { d: dash, "class": "scs-line" }, box);
    var t = el("text", { x: W - 70, y: H - 34, "class": "scs-text" }, box);
    t.textContent = "南海诸岛";
  }

  function drawLabels() {
    gLabels.textContent = "";
    GEO_LABELS.forEach(function (g) {
      var p = toXY(g[1], g[2]);
      var t = el("text", { x: p.x, y: p.y, "class": "geo-label" }, gLabels);
      t.textContent = g[0];
    });
  }

  function drawRoute() {
    gRoute.textContent = "";
    var evs = sortedEvents();
    if (evs.length < 2) return;
    var d = "";
    evs.forEach(function (ev, i) {
      var p = toXY(ev.lon, ev.lat);
      d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
    });
    el("path", { d: d, "class": "route-glow" }, gRoute);
    el("path", { d: d, "class": "route" }, gRoute);
    /* 终点箭头 */
    var a = toXY(evs[evs.length - 2].lon, evs[evs.length - 2].lat);
    var b = toXY(evs[evs.length - 1].lon, evs[evs.length - 1].lat);
    var ang = Math.atan2(b.y - a.y, b.x - a.x);
    var s = 7;
    var dArrow = "M" + b.x + "," + b.y +
      "L" + (b.x - s * Math.cos(ang - 0.45)) + "," + (b.y - s * Math.sin(ang - 0.45)) +
      "L" + (b.x - s * Math.cos(ang + 0.45)) + "," + (b.y - s * Math.sin(ang + 0.45)) + "Z";
    el("path", { d: dArrow, "class": "route-arrow" }, gRoute);
  }

  function drawStars() {
    gStars.textContent = "";
    sortedEvents().forEach(function (ev) {
      var p = toXY(ev.lon, ev.lat);
      var R = ev.major ? 13 : 9.5;
      var g = el("g", { "class": "star-g" + (ev.major ? " major" : ""), "data-id": ev.id, tabindex: "0", role: "button" }, gStars);

      var pulse = el("circle", { cx: p.x, cy: p.y, r: R, "class": "pulse" }, g);
      el("animate", { attributeName: "r", values: R + ";" + (R * 2.1), dur: "2.4s", repeatCount: "indefinite" }, pulse);
      el("animate", { attributeName: "opacity", values: "0.55;0", dur: "2.4s", repeatCount: "indefinite" }, pulse);

      el("circle", { cx: p.x, cy: p.y, r: R + 7, "class": "hit" }, g);
      el("path", { d: starPath(p.x, p.y, R), "class": "star" }, g);

      var t = el("text", { x: p.x, y: p.y + R + 13, "class": "star-label" }, g);
      t.textContent = ev.name.split("·")[0];
    });
  }

  function renderAll() { drawMap(); drawLabels(); drawRoute(); drawStars(); }

  /* ---------------- 详情面板 ---------------- */
  var sheet, sheetBody, sheetTitle, sheetDate;
  function openSheet(ev) {
    sheetTitle.textContent = ev.name;
    sheetDate.textContent = ev.date || "";
    sheetBody.textContent = ev.desc || "";
    sheet.classList.add("open");
    document.getElementById("btnSheetEdit").onclick = function () {
      closeSheet(); openEditor(ev);
    };
  }
  function closeSheet() { sheet.classList.remove("open"); }
  function findEvent(id) {
    for (var i = 0; i < data.events.length; i++) if (data.events[i].id === id) return data.events[i];
    return null;
  }

  /* ---------------- 编辑表单 ---------------- */
  var editor, fId, fName, fDate, fLon, fLat, fOrder, fMajor, fDesc, btnDelete;
  function openEditor(ev, isNew) {
    fId.value = ev.id;
    fName.value = ev.name || "";
    fDate.value = ev.date || "";
    fLon.value = ev.lon;
    fLat.value = ev.lat;
    fOrder.value = ev.order != null ? ev.order : data.events.length + 1;
    fMajor.checked = !!ev.major;
    fDesc.value = ev.desc || "";
    btnDelete.style.display = isNew ? "none" : "";
    editor.dataset.isNew = isNew ? "1" : "";
    editor.classList.add("open");
    setTimeout(function () { fName.focus(); }, 80);
  }
  function closeEditor() { editor.classList.remove("open"); }
  function saveEditor() {
    var name = fName.value.trim();
    if (!name) { fName.focus(); fName.classList.add("bad"); return; }
    fName.classList.remove("bad");
    var ev = {
      id: fId.value || ("e" + Date.now()),
      name: name,
      date: fDate.value.trim(),
      lon: parseFloat(fLon.value) || 0,
      lat: parseFloat(fLat.value) || 0,
      order: parseInt(fOrder.value, 10) || data.events.length + 1,
      major: fMajor.checked,
      desc: fDesc.value.trim()
    };
    var existing = findEvent(ev.id);
    if (existing && !editor.dataset.isNew) {
      for (var k in ev) existing[k] = ev[k];
    } else {
      data.events.push(ev);
    }
    saveData(); drawRoute(); drawStars(); closeEditor();
  }

  /* ---------------- 导入 / 导出 ---------------- */
  var ioModal, ioText;
  function openIO(mode) {
    ioModal.dataset.mode = mode;
    ioText.value = mode === "export" ? JSON.stringify(data, null, 2) : "";
    ioText.placeholder = mode === "export" ? "" : "把之前导出的 JSON 粘贴到这里…";
    document.getElementById("ioTitle").textContent = mode === "export" ? "导出内容（可复制分享）" : "导入内容";
    document.getElementById("btnIoOk").textContent = mode === "export" ? "复制" : "导入并覆盖";
    ioModal.classList.add("open");
    if (mode === "export") ioText.select();
  }
  function ioOk() {
    if (ioModal.dataset.mode === "export") {
      ioText.select();
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) {}
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ioText.value).then(function () { toast("已复制到剪贴板"); }, function () {});
      } else if (done) { toast("已复制到剪贴板"); }
      return;
    }
    try {
      var d = JSON.parse(ioText.value);
      if (!d || !Array.isArray(d.events) || !d.events.length) throw new Error("bad");
      data = d; saveData(); renderAll(); ioModal.classList.remove("open");
      document.getElementById("hTitle").textContent = data.title || DEFAULT_DATA.title;
      document.getElementById("hSub").textContent = data.sub || DEFAULT_DATA.sub;
      toast("导入成功");
    } catch (e) { toast("JSON 格式不正确，导入失败"); }
  }

  /* ---------------- 提示 ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------------- 交互绑定 ---------------- */
  function bindPointer() {
    var pointers = new Map();
    var downInfo = null, pinchDist = 0, draggingStar = null, starMoved = false;

    svg.addEventListener("pointerdown", function (e) {
      svg.setPointerCapture(e.pointerId);
      var p = svgPoint(e.clientX, e.clientY);
      pointers.set(e.pointerId, p);
      if (pointers.size === 2) {
        var arr = Array.from(pointers.values());
        pinchDist = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
        downInfo = null;
        return;
      }
      var starEl = e.target.closest ? e.target.closest(".star-g") : null;
      draggingStar = (editMode && starEl) ? starEl.getAttribute("data-id") : null;
      starMoved = false;
      downInfo = { x: p.x, y: p.y, tx: view.tx, ty: view.ty, starEl: starEl, t: Date.now() };
    });

    svg.addEventListener("pointermove", function (e) {
      if (!pointers.has(e.pointerId)) return;
      var p = svgPoint(e.clientX, e.clientY);
      pointers.set(e.pointerId, p);
      if (pointers.size === 2) {
        var arr = Array.from(pointers.values());
        var d = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
        if (pinchDist > 0) {
          var mid = { x: (arr[0].x + arr[1].x) / 2, y: (arr[0].y + arr[1].y) / 2 };
          zoomAt(mid.x, mid.y, d / pinchDist);
        }
        pinchDist = d;
        return;
      }
      if (!downInfo) return;
      var dx = p.x - downInfo.x, dy = p.y - downInfo.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) starMoved = true;
      if (draggingStar) {
        /* 编辑模式：拖动五角星改变位置 */
        var ev = findEvent(draggingStar);
        if (ev && starMoved) {
          var w = worldPoint(e.clientX, e.clientY);
          var ll = toLonLat(w.x, w.y);
          ev.lon = Math.max(73, Math.min(135, ll.lon));
          ev.lat = Math.max(17, Math.min(54, ll.lat));
          drawRoute(); drawStars();
        }
      } else {
        view.tx = downInfo.tx + dx; view.ty = downInfo.ty + dy;
        applyView();
      }
    });

    function up(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (draggingStar) { saveData(); }
      if (downInfo && !starMoved && Date.now() - downInfo.t < 400) {
        var starEl = downInfo.starEl;
        if (starEl) {
          var ev = findEvent(starEl.getAttribute("data-id"));
          if (ev) {
            if (editMode) { openEditor(ev); }
            else { focusEvent(ev); openSheet(ev); }
          }
        } else if (editMode) {
          /* 编辑模式下点击空白：在此添加事件 */
          var w = worldPoint(e.clientX, e.clientY);
          var ll = toLonLat(w.x, w.y);
          if (ll.lon >= 73 && ll.lon <= 135 && ll.lat >= 17 && ll.lat <= 54.5) {
            openEditor({ id: "", name: "", date: "", lon: ll.lon, lat: ll.lat,
                         order: data.events.length + 1, major: false, desc: "" }, true);
          }
        } else {
          closeSheet();
        }
      }
      downInfo = null; draggingStar = null;
    }
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);

    svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      var p = svgPoint(e.clientX, e.clientY);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 1.25 : 0.8);
    }, { passive: false });
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    svg = document.getElementById("map");
    vp = document.getElementById("viewport");
    gMap = document.getElementById("gMap");
    gLabels = document.getElementById("gLabels");
    gRoute = document.getElementById("gRoute");
    gStars = document.getElementById("gStars");
    sheet = document.getElementById("sheet");
    sheetTitle = document.getElementById("sheetTitle");
    sheetDate = document.getElementById("sheetDate");
    sheetBody = document.getElementById("sheetBody");
    editor = document.getElementById("editor");
    fId = document.getElementById("fId"); fName = document.getElementById("fName");
    fDate = document.getElementById("fDate"); fLon = document.getElementById("fLon");
    fLat = document.getElementById("fLat"); fOrder = document.getElementById("fOrder");
    fMajor = document.getElementById("fMajor"); fDesc = document.getElementById("fDesc");
    btnDelete = document.getElementById("btnDelete");
    ioModal = document.getElementById("ioModal"); ioText = document.getElementById("ioText");

    document.getElementById("hTitle").textContent = data.title || DEFAULT_DATA.title;
    document.getElementById("hSub").textContent = data.sub || DEFAULT_DATA.sub;

    renderAll();
    bindPointer();
    applyView();

    document.getElementById("btnZoomIn").onclick = function () { zoomAt(W / 2, H / 2, 1.4); };
    document.getElementById("btnZoomOut").onclick = function () { zoomAt(W / 2, H / 2, 0.7); };
    document.getElementById("btnReset").onclick = function () { resetView(); closeSheet(); };
    document.getElementById("btnSheetClose").onclick = closeSheet;
    document.getElementById("btnEdClose").onclick = closeEditor;
    document.getElementById("btnSave").onclick = saveEditor;
    btnDelete.onclick = function () {
      var ev = findEvent(fId.value);
      if (ev && confirm("确定删除「" + ev.name + "」吗？")) {
        data.events = data.events.filter(function (x) { return x.id !== ev.id; });
        saveData(); drawRoute(); drawStars(); closeEditor();
      }
    };
    document.getElementById("btnEdit").onclick = function () {
      editMode = !editMode;
      document.body.classList.toggle("editing", editMode);
      this.textContent = editMode ? "完成" : "编辑";
      document.getElementById("editBar").classList.toggle("show", editMode);
      closeSheet();
      if (editMode) toast("编辑模式：点星星改内容，点地图加新事件，可拖动星星调整位置");
    };
    document.getElementById("btnTitle").onclick = function () {
      var t = prompt("标题：", data.title || DEFAULT_DATA.title);
      if (t && t.trim()) {
        data.title = t.trim();
        document.getElementById("hTitle").textContent = data.title;
      }
      var s = prompt("副标题：", data.sub || DEFAULT_DATA.sub);
      if (s !== null) {
        data.sub = s.trim();
        document.getElementById("hSub").textContent = data.sub;
      }
      saveData();
    };
    document.getElementById("btnExport").onclick = function () { openIO("export"); };
    document.getElementById("btnImport").onclick = function () { openIO("import"); };
    document.getElementById("btnIoOk").onclick = ioOk;
    document.getElementById("btnIoClose").onclick = function () { ioModal.classList.remove("open"); };
    document.getElementById("btnDefault").onclick = function () {
      if (confirm("恢复为默认内容？你修改的内容将被清除。")) {
        data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData(); renderAll();
        document.getElementById("hTitle").textContent = data.title;
        document.getElementById("hSub").textContent = data.sub;
        toast("已恢复默认内容");
      }
    };
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeSheet(); closeEditor(); ioModal.classList.remove("open"); }
    });
  });
})();
