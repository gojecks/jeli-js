// jEli Browser Support
var $isSupport =
{
  websql: !!window.openDatabase,
  sqlite : !!window.sqlitePlugin,
  canvas: !!document.createElement('canvas').getContext,
  history: !!(window.history && history.pushState),
  jsonParser: !!(window.JSON && window.JSON.parse),
  domParser: !!(window.DOMParser),
  computedStyle : !!(window.getComputedStyle),
  indexedDB : window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || false,
  localStorage : !!window.localStorage || !1,
  slice : window.Blob && (Blob.prototype.slice ||Blob.prototype.webkitSlice || Blob.prototype.mozSlice),
  isFormData : window.FormData,
  xhrFileUpload : !!(window.XMLHttpRequestUpload && window.FileReader),
  fileReader : (window.File&&window.FileReader&&window.FileList&&window.Blob),
  webWorker:!!window.Worker,
  dom:
  {
    cloning: (function () 
    {
      var div = document.createElement('div'),
          _clone = div.cloneNode();
      div = null;
      return !!_clone;
    })(),
    qsa: !!document.querySelectorAll
  },
  browser :  
  {
      moz : 'MozAppearance' in document.createElement('div').style,
      webkit : 'WebkitAppearance' in document.createElement('div').style,
      msie : 'msTransform' in document.createElement('div').style,
      opera : 'OAppearance' in document.createElement('div').style
  },
  env : 
  {
    android: ((navigator.userAgent.match(/Android/i) || []).length?true:false),
    blackBerry: ((navigator.userAgent.match(/BlackBerry/i) || []).length?true:false),
    ios: ((navigator.userAgent.match(/iPhone|iPad|iPod/i) || []).length?true:false),
    opera: ((navigator.userAgent.match(/Opera Mini/i) || []).length?true:false),
    windows:((navigator.userAgent.match(/IEMobile/i)  || []).length?true:false),
    chrome : ((navigator.userAgent.match(/chrome/i)  || []).length?true:false),
    firefox : ((navigator.userAgent.match(/firefox/i)  || []).length?true:false),
    safari : ((navigator.userAgent.match(/safari/i)  || []).length?true:false),
    ie:/Edge\/|Trident\/|MSIE /.test(navigator.userAgent),
    ieG10:/Edge\/|Trident\/| /.test(navigator.userAgent)
  },
  cookieEnabled : navigator.cookieEnabled
};

$isSupport.env.mobile = (function(env)
{ 
	return (env.android || env.blackBerry || env.ios || env.opera || env.windows  || false); 
})($isSupport.env);

// check for css3 Support
$isSupport.css3 = function (prop)
{
  var cs = 'Khtml Moz O Ms Webkit'.split(' '),
  cst = document.createElement('div').style,
  len = cs.length,
  sty = function (key) {
  return '-' + cs[key] + '-' + prop;
  };
  if (prop in cst){
     return prop;
  }
  while (len--)
  {
    chk = cs[len] + prop.charAt(0).toUpperCase() + cs[len].slice(1);
    if (chk in cst)
    {
      return sty(len);
    }
  }
  return false;
};