(this["webpackJsonpvk-your-diary"]=this["webpackJsonpvk-your-diary"]||[]).push([[42],{206:function(e,t,n){"use strict";n.r(t),n.d(t,"startInputShims",(function(){return p}));var o=n(1),r=n(29),i=new WeakMap,a=function(e,t,n,o){void 0===o&&(o=0),i.has(e)!==n&&(n?c(e,t,o):s(e,t))},u=function(e){return e===e.getRootNode().activeElement},c=function(e,t,n){var o=t.parentNode,r=t.cloneNode(!1);r.classList.add("cloned-input"),r.tabIndex=-1,o.appendChild(r),i.set(e,r);var a="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform="translate3d("+a+"px,"+n+"px,0) scale(0)"},s=function(e,t){var n=i.get(e);n&&(i.delete(e),n.remove()),e.style.pointerEvents="",t.style.transform=""},d="input, textarea, [no-blur]",l=function(e,t,n,o){var r=e.top,i=e.bottom,a=t.top,u=a+15,c=.75*Math.min(t.bottom,o-n)-i,s=u-r,d=Math.round(c<0?-c:s>0?-s:0),l=Math.min(d,r-a),f=Math.abs(l)/.3;return{scrollAmount:l,scrollDuration:Math.min(400,Math.max(150,f)),scrollPadding:n,inputSafeY:4-(r-u)}},f=function(e,t,n,r,i){return Object(o.b)(void 0,void 0,void 0,(function(){var u,c,s,d,f,v;return Object(o.d)(this,(function(m){switch(m.label){case 0:return n||r?(u=function(e,t,n){var o=e.closest("ion-item,[ion-item]")||e;return l(o.getBoundingClientRect(),t.getBoundingClientRect(),n,e.ownerDocument.defaultView.innerHeight)}(e,n||r,i),n&&Math.abs(u.scrollAmount)<4?(t.focus(),[2]):(a(e,t,!0,u.inputSafeY),t.focus(),"undefined"===typeof window?[3,3]:(s=function(){return Object(o.b)(void 0,void 0,void 0,(function(){return Object(o.d)(this,(function(o){switch(o.label){case 0:return void 0!==c&&clearTimeout(c),window.removeEventListener("ionKeyboardDidShow",d),window.removeEventListener("ionKeyboardDidShow",s),n?[4,n.scrollByPoint(0,u.scrollAmount,u.scrollDuration)]:[3,2];case 1:o.sent(),o.label=2;case 2:return a(e,t,!1,u.inputSafeY),t.focus(),[2]}}))}))},d=function(){window.removeEventListener("ionKeyboardDidShow",d),window.addEventListener("ionKeyboardDidShow",s)},n?[4,n.getScrollElement()]:[3,2]))):[2];case 1:if(f=m.sent(),v=f.scrollHeight-f.clientHeight,u.scrollAmount>v-f.scrollTop)return"password"===t.type?(u.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",d)):window.addEventListener("ionKeyboardDidShow",s),c=setTimeout(s,1e3),[2];m.label=2;case 2:s(),m.label=3;case 3:return[2]}}))}))},v=function(e,t,n){if(t&&n){var o=t.x-n.x,r=t.y-n.y;return o*o+r*r>e*e}return!1},m=function(e,t){if("INPUT"===e.tagName&&(!e.parentElement||"ION-INPUT"!==e.parentElement.tagName)&&(!e.parentElement||!e.parentElement.parentElement||"ION-SEARCHBAR"!==e.parentElement.parentElement.tagName)){var n=e.closest("ion-content");if(null!==n){var o=n.$ionPaddingTimer;o&&clearTimeout(o),t>0?n.style.setProperty("--keyboard-offset",t+"px"):n.$ionPaddingTimer=setTimeout((function(){n.style.setProperty("--keyboard-offset","0px")}),120)}}},p=function(e){var t=document,n=e.getNumber("keyboardHeight",290),i=e.getBoolean("scrollAssist",!0),c=e.getBoolean("hideCaretOnScroll",!0),s=e.getBoolean("inputBlurring",!0),l=e.getBoolean("scrollPadding",!0),p=Array.from(t.querySelectorAll("ion-input, ion-textarea")),h=new WeakMap,b=new WeakMap,E=function(e){return Object(o.b)(void 0,void 0,void 0,(function(){var t,s,d,l,m;return Object(o.d)(this,(function(o){switch(o.label){case 0:return e.componentOnReady?[4,e.componentOnReady()]:[3,2];case 1:o.sent(),o.label=2;case 2:return t=e.shadowRoot||e,s=t.querySelector("input")||t.querySelector("textarea"),d=e.closest("ion-content"),l=d?null:e.closest("ion-footer"),s?(d&&c&&!h.has(e)&&(m=function(e,t,n){if(!n||!t)return function(){};var o=function(n){u(t)&&a(e,t,n)},r=function(){return a(e,t,!1)},i=function(){return o(!0)},c=function(){return o(!1)};return n.addEventListener("ionScrollStart",i),n.addEventListener("ionScrollEnd",c),t.addEventListener("blur",r),function(){n.removeEventListener("ionScrollStart",i),n.removeEventListener("ionScrollEnd",c),t.addEventListener("ionBlur",r)}}(e,s,d),h.set(e,m)),(d||l)&&i&&!b.has(e)&&(m=function(e,t,n,o,i){var a,c=function(e){a=Object(r.k)(e)},s=function(c){if(a){var s=Object(r.k)(c);v(6,a,s)||u(t)||(c.preventDefault(),c.stopPropagation(),f(e,t,n,o,i))}};return e.addEventListener("touchstart",c,!0),e.addEventListener("touchend",s,!0),function(){e.removeEventListener("touchstart",c,!0),e.removeEventListener("touchend",s,!0)}}(e,s,d,l,n),b.set(e,m)),[2]):[2]}}))}))};s&&function(){var e=!0,t=!1,n=document,o=function(){t=!0},r=function(){e=!0},i=function(o){if(t)t=!1;else{var r=n.activeElement;if(r&&!r.matches(d)){var i=o.target;i!==r&&(i.matches(d)||i.closest(d)||(e=!1,setTimeout((function(){e||r.blur()}),50)))}}};n.addEventListener("ionScrollStart",o),n.addEventListener("focusin",r,!0),n.addEventListener("touchend",i,!1)}(),l&&function(e){var t=document,n=function(t){m(t.target,e)},o=function(e){m(e.target,0)};t.addEventListener("focusin",n),t.addEventListener("focusout",o)}(n);for(var w=0,y=p;w<y.length;w++){var g=y[w];E(g)}t.addEventListener("ionInputDidLoad",(function(e){E(e.detail)})),t.addEventListener("ionInputDidUnload",(function(e){!function(e){var t;c&&((t=h.get(e))&&t(),h.delete(e));i&&((t=b.get(e))&&t(),b.delete(e))}(e.detail)}))}}}]);
//# sourceMappingURL=42.e1dd7943.chunk.js.map