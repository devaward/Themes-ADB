/*<![CDATA[*/
function Index_anilist(a) {
    this.abjad = {};
    this.overkeys = [];
    this.grab = function() {
        var g = a.feed.entry;
        var c = g.length;
        for (var d = 0; d < c; d++) {
            if (d == c) {
                break
            }
            var f = g[d];
            var h = f.title.$t;
            var i = "";
            for (var b = 0; b < f.link.length; b++) {
                if (f.link[b].rel == "alternate") {
                    i = f.link[b].href
                }
            }
            var e = h.substr(0, 1).toLowerCase();
            var j = {
                title: h,
                linkpost: i
            };
            if (typeof this.abjad[e] == "undefined") {
                this.abjad[e] = [j]
            } else {
                if (typeof this.abjad[e] == "object") {
                    this.abjad[e].push(j)
                }
            }
        }
    };
    this.filter = function() {
        for (var b in this.abjad) {
            this.overkeys.push(b);
            this.overkeys.sort()
        }
    };
    this.buildingscripts = function() {
        for (var c in this.overkeys) {
            var j = this.overkeys[c];
            var i = j.toUpperCase();
            var e = this.abjad[j];
            var g = [];
            var h = [];
            document.write('<a class="abjad-alfabet" name=' + i + ">" + i + "</a>");
            document.write('<ul class="list-post">');
            for (var d = 0; d < e.length; d++) {
                g.push(e[d].title);
                g.sort()
            }
            for (var d = 0; d < e.length; d++) {
                var k = g[d];
                var f = "";
                for (var b = 0; b < e.length; b++) {
                    if (e[b].title == k) {
                        f = e[b].linkpost
                    }
                }
                document.write('<li><a href="' + f + '">' + k + "</a></li>")
            }
            document.write("</ul>")
        }
    };
    this.run = function() {
        this.grab();
        this.filter();
        this.buildingscripts()
    }
}

function show_anilist(b) {
    var a = new Index_anilist(b);
    a.run()
};
document.write("<div id='abjad-filted'>\r\n<a href='#A'>A</a><a href='#B'>B</a><a href='#C'>C</a><a href='#D'>D</a><a href='#E'>E</a><a href='#F'>F</a><a href='#G'>G</a><a href='#H'>H</a><a href='#I'>I</a><a href='#J'>J</a><a href='#K'>K</a><a href='#L'>L</a><a href='#M'>M</a><a href='#N'>N</a><a href='#O'>O</a><a href='#P'>P</a><a href='#Q'>Q</a><a href='#R'>R</a><a href='#S'>S</a><a href='#T'>T</a><a href='#U'>U</a><a href='#V'>V</a><a href='#W'>W</a><a href='#X'>X</a><a href='#Y'>Y</a><a href='#Z'>Z</a><div class=\"clear\"></div>\r\n</div>");
document.write('<script src="/feeds/posts/default/-/animeinfo?orderby=published&alt=json-in-script&callback=show_anilist&start-index=1&max-results=888"><\/script>'); /*]]>*/
