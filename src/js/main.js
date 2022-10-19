//select
var x, i, j, l, ll, selElmnt, a, b, c;
x = document.getElementsByClassName("select__custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    a = document.createElement("DIV");
    a.setAttribute("class", "select__select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select__select-items select__select-items_hide");
    b.setAttribute("id", "scrollSelect");

    d = document.createElement("DIV");
    d.setAttribute("id", "optionElemContainer");

    for (j = 1; j < ll; j++) {
        c = document.createElement("DIV");
        // c.setAttribute("class", "select__optionElem");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.parentNode.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("select__is-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "select__is-selected");
                    break;
                }
            }
            h.click();
        });
        d.appendChild(c);
    }
    b.appendChild(d);


    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select__select-items_hide");
        this.classList.toggle("select__select-selected_active");

        ssb.refresh();
    });
}
function closeAllSelect(elmnt) {
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select__select-items");
    y = document.getElementsByClassName("select__select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select__select-selected_active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select__select-items_hide");
        }
    }
}
document.addEventListener("click", closeAllSelect);

//scroll
var ssb = {
    aConts  : [],
    mouseY : 0,
    N  : 0,
    asd : 0, /*active scrollbar element*/
    sc : 0,
    sp : 0,
    to : 0,

    // constructor
    scrollbar : function (cont_id) {
        var cont = document.getElementById(cont_id);

        // perform initialization
        if (! ssb.init()) return false;

        var cont_clone = cont.cloneNode(false);
        // cont_clone.style.overflow = "hidden";
        cont.parentNode.appendChild(cont_clone);
        cont_clone.appendChild(cont);
        // cont.style.position = 'absolute';
        // cont.style.left = cont.style.top = '0px';
        // cont.style.width = cont.style.height = '100%';

        // adding new container into array
        ssb.aConts[ssb.N++] = cont;

        cont.sg = false;

        //creating scrollbar child elements select__ssb_sb
        cont.st = this.create_div('select__scrollbar-track', cont, cont_clone);
        cont.sb = this.create_div('select__scrollbar-thumb', cont, cont_clone);
        // cont.su = this.create_div('select__ssb_up', cont, cont_clone);
        // cont.sd = this.create_div('select__ssb_down', cont, cont_clone);

        // on mouse down processing
        cont.sb.onmousedown = function (e) {
            if (! this.cont.sg) {
                if (! e) e = window.event;

                ssb.asd = this.cont;
                this.cont.yZ = e.screenY;
                this.cont.sZ = cont.scrollTop;
                this.cont.sg = true;

                // new class name
                this.className = 'select__scrollbar-thumb select__scrollbar-thumb_down';
            }
            return false;
        }
        // on mouse down on free track area - move our scroll element too
        cont.st.onmousedown = function (e) {
            if (! e) e = window.event;
            ssb.asd = this.cont;

            ssb.mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            for (var o = this.cont, y = 0; o != null; o = o.offsetParent) y += o.offsetTop;
            this.cont.scrollTop = (ssb.mouseY - y - (this.cont.ratio * this.cont.offsetHeight / 2) - this.cont.sw) / this.cont.ratio;
            this.cont.sb.onmousedown(e);
        }

        // onmousedown events
        // cont.su.onmousedown = cont.su.ondblclick = function (e) { ssb.mousedown(this, -1); return false; }
        // cont.sd.onmousedown = cont.sd.ondblclick = function (e) { ssb.mousedown(this,  1); return false; }

        //onmouseout events
        // cont.su.onmouseout = cont.su.onmouseup = ssb.clear;
        // cont.sd.onmouseout = cont.sd.onmouseup = ssb.clear;

        // on mouse over - apply custom class name: ssb_sb_over
        cont.sb.onmouseover = function (e) {
            if (! this.cont.sg) this.className = 'select__scrollbar-thumb select__scrollbar-thumb_over';
            return false;
        }

        // on mouse out - revert back our usual class name 'ssb_sb'
        cont.sb.onmouseout  = function (e) {
            if (! this.cont.sg) this.className = 'select__scrollbar-thumb';
            return false;
        }

        // onscroll - change positions of scroll element
        cont.ssb_onscroll = function () {
            // this.ratio = (this.offsetHeight - 2 * this.sw) / this.scrollHeight;
            this.ratio = (this.offsetHeight - 1 * this.sw) / this.scrollHeight;
            this.sb.style.topNum = Math.floor(this.sw  + this.scrollTop * this.ratio - 3);
            if ( this.st.clientHeight - this.sb.clientHeight -  this.sb.style.topNum < 0 ) {
                this.sb.style.topNum = this.st.clientHeight - this.sb.clientHeight;
            }
            this.sb.style.top = this.sb.style.topNum + 1 + 'px';
        }

        // scrollbar width
        cont.sw = 7;

        // start scrolling
        cont.ssb_onscroll();
        ssb.refresh();

        // binding own onscroll event
        cont.onscroll = cont.ssb_onscroll;
        return cont;
    },

    // initialization
    init : function () {
        if (window.oper || (! window.addEventListener && ! window.attachEvent)) { return false; }

        // temp inner function for event registration
        function addEvent (o, e, f) {
            if (window.addEventListener) { o.addEventListener(e, f, false); ssb.w3c = true; return true; }
            if (window.attachEvent) return o.attachEvent('on' + e, f);
            return false;
        }

        // binding events
        addEvent(window.document, 'mousemove', ssb.onmousemove);
        addEvent(window.document, 'mouseup', ssb.onmouseup);
        addEvent(window, 'resize', ssb.refresh);
        addEvent(window, 'click', ssb.refresh);
        return true;
    },

    // create and append div finc
    create_div : function(c, cont, cont_clone) {
        var o = document.createElement('div');
        o.cont = cont;
        o.className = c;
        cont_clone.appendChild(o);
        return o;
    },
    // do clear of controls
    clear : function () {
        clearTimeout(ssb.to);
        ssb.sc = 0;
        return false;
    },
    // refresh scrollbar
    refresh : function () {
        for (var i = 0, N = ssb.N; i < N; i++) {
            var o = ssb.aConts[i];
            o.ssb_onscroll();
            // o.sb.style.width = o.st.style.width = o.su.style.width = o.su.style.height = o.sd.style.width = o.sd.style.height = o.sw + 'px';
            o.sb.style.height = Math.ceil(Math.max(o.sw * .5, o.ratio * o.offsetHeight) + 1) + 'px';
        }
    },
    // arrow scrolling
    arrow_scroll : function () {
        if (ssb.sc != 0) {
            ssb.asd.scrollTop += 6 * ssb.sc / ssb.asd.ratio;
            ssb.to = setTimeout(ssb.arrow_scroll, ssb.sp);
            ssb.sp = 32;
        }
    },

    /* event binded functions : */
    // scroll on mouse down
    mousedown : function (o, s) {
        if (ssb.sc == 0) {
            // new class name
            o.cont.sb.className = 'select__scrollbar-thumb select__scrollbar-thumb_down';
            ssb.asd = o.cont;
            ssb.sc = s;
            ssb.sp = 400;
            ssb.arrow_scroll();
        }
    },
    // on mouseMove binded event
    onmousemove : function(e) {
        if (! e) e = window.event;
        // get vertical mouse position
        ssb.mouseY = e.screenY;
        if (ssb.asd.sg) ssb.asd.scrollTop = ssb.asd.sZ + (ssb.mouseY - ssb.asd.yZ) / ssb.asd.ratio;
    },
    // on mouseUp binded event
    onmouseup : function (e) {
        if (! e) e = window.event;
        var tg = (e.target) ? e.target : e.srcElement;
        if (ssb.asd && document.releaseCapture) ssb.asd.releaseCapture();

        // new class name
        if (ssb.asd) ssb.asd.sb.className = (tg.className.indexOf('scrollbar') > 0) ? 'select__scrollbar-thumb select__scrollbar-thumb_over' : 'select__scrollbar-thumb';
        document.onselectstart = '';
        ssb.clear();
        ssb.asd.sg = false;
    }
}
window.onload = function() {
    // ssb.scrollbar('container');
    ssb.scrollbar('scrollSelect');
}

//range
let slider = document.getElementById("range");
let output = document.getElementById("rangeValue");
output.innerHTML = slider.value + '%';
slider.oninput = function() {
    output.innerHTML = this.value + '%';
}


window.onscroll = function() {stickyHeader()};
var header = document.getElementById("header");
var sticky = header.offsetTop;
function stickyHeader() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}
