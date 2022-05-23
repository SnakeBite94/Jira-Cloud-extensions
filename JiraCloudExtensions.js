// ==UserScript==
// @name         Jira Cloud extensions
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy Jira Cloud issue key and description to clipboard; Set description editor max height, so the toolbar stays visible;
// @author       Dejf
// @match        https://*/browse/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/SnakeBite94/Jira-Cloud-extensions/main/JiraCloudExtensions.js
// ==/UserScript==

(function () {
    'use strict';
    //GM_addStyle('.ak-editor-content-area { max-height: 480px; }');
    addToolbarButton('📋 To clipboard', copyJiraKeyAndDescriptionToClip);
    addCollapseRightPanelButton();
})();

function addCollapseRightPanelButton() {
    whenAvailable("jira-issue-header-actions", function () {
        const rightPanel = document.getElementById("jira-issue-header-actions").parentElement.parentElement;
        let btn = document.createElement('button')
        btn.innerHTML = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><path d=\"M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z\" fill=\"currentColor\" fill-rule=\"evenodd\"></path></svg>";
        btn.id = "collapse-right-panel";
        btn.style.position = "relative";
        btn.style.left = "5px";
        btn.style.top = "25px";
        btn.style.fontSize = "15pt";
        btn.style.borderRadius = "50%";
        btn.style.width="24px";
        btn.style.height="24px";
        btn.style.border="none";
        btn.style.filter="drop-shadow(0px 0px 1px #444444)"
        btn.style.padding="0px";
        btn.style.background="white";
        btn.style.color="gray";

        btn.onmouseenter = function(){
            btn.style.background = "#4c9aff"
            btn.style.color = "white"
        }
        btn.onmouseleave = function(){
            btn.style.background="white";
            btn.style.color="gray";
        }

        btn.onclick = function () {
            rightPanel.style.display = "none";
        }
        rightPanel.insertBefore(btn, rightPanel.firstChild)
    });
}

function addToolbarButton(text, onclick, cssObj) {
    whenAvailable('jira-issue-header', function () {
        let button = document.createElement('button');
        let target = document.getElementById('jira-issue-header')
            .nextElementSibling.nextElementSibling.nextElementSibling;
        let cls = target.getElementsByTagName('button')[0].className;

        button.innerHTML = text;
        button.onclick = onclick;
        button.onsubmit = () => { };
        button.className = cls;
        target.appendChild(button);
    });
}

function copyJiraKeyAndDescriptionToClip() {
    let jiraKeyDesc = document.title;
    let key = jiraKeyDesc.match(/\[(.*)\]/)[1];
    let desc = jiraKeyDesc.match(/\] (.+) - /)[1];
    toClipboard(key + ' - ' + desc);
}

//-------------------------------------------------

function toClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
}

function whenAvailable(name, callback) {
    let interval = 10; // ms
    window.setTimeout(function () {
        if (window[name]) {
            callback(window[name]);
        } else {
            whenAvailable(name, callback);
        }
    }, interval);
}

function getElementsByText(str, tag = 'a') {
    return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
