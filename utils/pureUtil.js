function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new TypeError('The constructor to "inherits" must not be ' +
      'null or undefined');

  if (superCtor === undefined || superCtor === null)
    throw new TypeError('The super constructor to "inherits" must not ' +
      'be null or undefined');

  if (superCtor.prototype === undefined)
    throw new TypeError('The super constructor to "inherits" must ' +
      'have a prototype');

  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
};


function formatDuration(time = 0) {
  var seconds = parseInt(time % 60) >= 10 ? parseInt(time % 60) : '0' + parseInt(time % 60);
  var minutes = parseInt(time / 60 % 60) >= 10 ? parseInt(time / 60 % 60) : '0' + parseInt(time / 60 % 60);
  var hours = parseInt(time / 3600 % 24);
  if (hours != 0) {
    return (hours + ':' + minutes + ':' + seconds);
  } else {
    return (minutes + ':' + seconds);
  }
}


function wrapFn(page, fnName, innerFn) {
  var fn = page[fnName] || function () { }
  page[fnName] = function () {
    fn.call(page, arguments)
    innerFn.call(page, arguments)
  }
}

function checkPageExist(pageName){
  let pages = getCurrentPages;
  for(let i=0;i<pages.length;i++){
    if(pages[i].type === pageName){
      return pages[i];
    }
  }
  return false;
}

function jumpTo(options) {
  var url = options.url || "";
  var to = (url.match(/.+\/(\w+)/i) || ['index', 'index'])[1];
  var pages = getCurrentPages();
  var i = 0;
  while (pages[i] && pages[i].type !== to) {
    i++;
  }
  //已有页面在栈里，返回
  if (i < pages.length - 1 && to !== "albumDetail") {
    var delta = pages.length - 1 - i;
    wx.navigateBack({
      delta: delta
    });
    return;
  }
  //是当前页，刷新当前页
  if (i === pages.length - 1) {
    wx.redirectTo({
      url: url
    });
    return;
  }
  //如果页面数已经大于上线，怎重定向
  if (pages.length >= 5) {
    wx.redirectTo({
      url: url
    });
    return;
  }
  wx.navigateTo({
    url: url
  });
}


export default {
  inherits,
  formatDuration,
  wrapFn,
  checkPageExist,
  jumpTo
}