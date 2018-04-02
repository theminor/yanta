define("ace/theme/yanta",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-yanta";

/*
Color Scheme:
Ink/Blue: #062F4F       rgb(6,47,79)
Embers/Red: #B82601     rgb(184,38,1)
Black: #000000          rgb(0,0,0)
Posy/Purple: #813772    rgb(129,55,114)
Yellow: #ECA400         rgb(236,164,0)
Gray: #828182           rgb(130,129,130)
Moss Green: #708D81
Brighter Green: #7FB069
*/

exports.cssText = ".ace-yanta .ace_gutter {\
background: #ebebeb;\
color: #333;\
overflow: hidden;\
}\
.ace-yanta .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-yanta {\
background-color: #F4F0E5;\
color: black;\
}\
.ace-yanta .ace_identifier {\
color: black;\
}\
.ace-yanta .ace_keyword {\
color: #0000FF;\
}\
.ace-yanta .ace_numeric {\
color: black;\
}\
.ace-yanta .ace_storage {\
color: #11B7BE;\
}\
.ace-yanta .ace_keyword.ace_operator,\
.ace-yanta .ace_lparen,\
.ace-yanta .ace_rparen,\
.ace-yanta .ace_punctuation {\
color: #808080;\
}\
.ace-yanta .ace_set.ace_statement {\
color: #0000FF;\
text-decoration: underline;\
}\
.ace-yanta .ace_cursor {\
color: black;\
}\
.ace-yanta .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-yanta .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-yanta .ace_constant.ace_language {\
color: #979797;\
}\
.ace-yanta .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-yanta .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-yanta .ace_support.ace_function {\
color: #ECA400;\
}\
.ace-yanta .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-yanta .ace_class {\
color: #008080;\
}\
.ace-yanta .ace_support.ace_other {\
color: #6D79DE;\
}\
.ace-yanta .ace_variable.ace_parameter {\
font-style: italic;\
color: #FD971F;\
}\
.ace-yanta .ace_comment {\
color: #008000;\
}\
.ace-yanta .ace_constant.ace_numeric {\
color: black;\
}\
.ace-yanta .ace_variable {\
color: #ECA400;\
}\
.ace-yanta .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-yanta .ace_support.ace_storedprocedure {\
color: #800000;\
}\
.ace-yanta .ace_heading {\
color: #B82601;\
font-weight: bold;\
}\
.ace_heading.ace_1 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_heading.ace_2 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_heading.ace_3 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_heading.ace_4 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_heading.ace_5 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_heading.ace_6 {\
font-weight: normal;\
color: #828182;\
font-size: 14px;\
}\
.ace_1+.ace_heading {\
font-size: 26px;\
line-height: 75%;\
}\
.ace_2+.ace_heading {\
font-size: 22px;\
line-height: 85%;\
color: #D36135;\
}\
.ace_3+.ace_heading {\
font-size: 20px;\
line-height: 90%;\
color: #FF7733;\
}\
.ace_4+.ace_heading {\
font-size: 18px;\
line-height: 95%;\
color: #F87060;\
}\
.ace_5+.ace_heading {\
font-size: 17px;\
color: #960200;\
}\
.ace_6+.ace_heading {\
font-size: 16px;\
color: #CE6C47;\
}\
.ace-yanta .ace_list {\
color: #062F4F;\
}\
.ace_markup.ace_list {\
color: #828182;\
}\
.ace_markup.ace_underline {\
color: #708D81;\
}\
.ace_emphasis {\
font-style: italic;\
}\
.ace_strong {\
font-weight: bold;\
}\
.ace-yanta .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-yanta .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-yanta .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-yanta .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-yanta .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-yanta .ace_gutter-active-line {\
background-color: #dcdcdc;\
}\
.ace-yanta .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-yanta .ace_meta.ace_tag {\
color: #0000FF;\
}\
.ace-yanta .ace_string.ace_regex {\
color: #2978A0;\
}\
.ace-yanta .ace_string {\
color: #2978A0;\
}\
.ace-yanta .ace_blockquote {\
color: #7FB069;\
}\
.ace-yanta .ace_entity.ace_other.ace_attribute-name {\
color: #994409;\
}\
.ace-yanta .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    window.require(["ace/theme/yanta"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
