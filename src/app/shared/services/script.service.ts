import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  constructor() {}

  public loadChatScript(): void {
    const scriptAsString = `


    var t = (window.driftt = window.drift = window.driftt || []);

    (t.load = function(t) { 
      var e = 3e5,
        n = Math.ceil(new Date() / e) * e,
        o = document.createElement("script");
      (o.type = "text/javascript"),
        (o.async = !0),
        (o.crossorigin = "anonymous"),
        (o.src =
          "https://js.driftt.com/include/" + n + "/" + t + ".js");
      var i = document.getElementsByTagName("script")[0];
     
      i.parentNode.insertBefore(o, i);
    });

    (t.methods = [
      "identify",
      "config",
      "track",
      "reset",
      "debug",
      "show",
      "ping",
      "page",
      "hide",
      "off",
      "on"
    ]);

    (t.factory = function(e) {
      return function() {
        var n = Array.prototype.slice.call(arguments);
        return n.unshift(e), t.push(n), t;
      };
    });

    if (!t.init) {
      if (t.invoked) {

        (t.load = function(t) { 
          var e = 3e5,
            n = Math.ceil(new Date() / e) * e,
            o = document.createElement("script");
          (o.type = "text/javascript"),
            (o.async = !0),
            (o.crossorigin = "anonymous"),
            (o.src =
              "https://js.driftt.com/include/" + n + "/" + t + ".js");
          var i = document.getElementsByTagName("script")[0];
         
          i.parentNode.insertBefore(o, i);
        });
       
      (t.invoked = !0),
        (t.methods = [
          "identify",
          "config",
          "track",
          "reset",
          "debug",
          "show",
          "ping",
          "page",
          "hide",
          "off",
          "on"
        ]),
        (t.factory = function(e) {
          return function() {
            var n = Array.prototype.slice.call(arguments);
            return n.unshift(e), t.push(n), t;
          };
        }),
        t.methods.forEach(function(e) {
          t[e] = t.factory(e);
        }),
        (t.load = function(t) { 
          var e = 3e5,
            n = Math.ceil(new Date() / e) * e,
            o = document.createElement("script");
          (o.type = "text/javascript"),
            (o.async = !0),
            (o.crossorigin = "anonymous"),
            (o.src =
              "https://js.driftt.com/include/" + n + "/" + t + ".js");
          var i = document.getElementsByTagName("script")[0];
        
          i.parentNode.insertBefore(o, i);
        });
       
    }
    t.SNIPPET_VERSION = "0.3.1";
    t.load("yumwszidc85g");
  }

`;
    const node = document.createElement('script');
    node.text = scriptAsString;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    this.showChatBox();

    document.getElementsByTagName('head')[0].appendChild(node);
  }

  public hideChatBox(): void {
    document.documentElement.style.setProperty('--chat-box-display', 'none');
  }

  public showChatBox(): void {
    document.documentElement.style.setProperty('--chat-box-display', 'block');
  }

  public setChatPosition(
    isDashBoard: boolean,
    isUnder992: boolean,
    isMobile: boolean,
    shouldMoveChatUpInSignicat: boolean
  ): void {
    let positionFromBottom = '90px';

    if (isDashBoard && isUnder992) {
      // done
      positionFromBottom = '90px';
    } else if (!isDashBoard && isUnder992) {
      positionFromBottom = '25px';
    } else if (isDashBoard && !isUnder992) {
      positionFromBottom = '25px';
    } else if (!isDashBoard && !isUnder992) {
      positionFromBottom = '25px';
    }

    if (shouldMoveChatUpInSignicat && isMobile) {
      positionFromBottom = '90px';
    }
    // Chatbox position variable is used in app.component.scss
    document.documentElement.style.setProperty(
      '--chat-position',
      positionFromBottom
    );
  }
}
