// ==UserScript==
// @name         Jira Cloud extensions
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  Copy Jira Cloud issue key and description to clipboard; Set description editor max height, so the toolbar stays visible;
// @author       Dejf
// @match        https://*/browse/*
// @match        https://issue-checklist-free-1.herocoders.com/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    https://raw.githubusercontent.com/SnakeBite94/Jira-Cloud-extensions/main/JiraCloudExtensions.js
// @downloadURL  https://raw.githubusercontent.com/SnakeBite94/Jira-Cloud-extensions/main/JiraCloudExtensions.js
// ==/UserScript==


(function () {
    'use strict';
    if (window.top != window.self) // iframe
    {
        if (window.name.includes("editor-dialog"))
        {
            waitForKeyElements('.css-h2743', e=> {
                e.css('margin-left', '50px');
            }, true); // true=onlyonce
        }
    }
    else // main page
    {
        addToolbarButton('📋 To clipboard', copyJiraKeyAndDescriptionToClip, initCopyJiraKeyAndDescriptionToClip);
        addCollapseRightPanelButton();
    }
})();

function addCollapseRightPanelButton() {
    waitForKeyElements(".sc-188kt4i-1.jMNOyQ", p => {
        const rightPanel = p[0];
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
    }, true);
}

function addToolbarButton(text, onclick, oninit) {
    waitForKeyElements('._otyr1b66._1yt4swc3._1e0c116y', target=> {
        let button = document.createElement('button');
        button.innerHTML = text;
        button.onclick = () => onclick(button);
        button.onsubmit = () => { };
        button.className = "css-gon3qk";
        button.style = "margin-left: 10px; height: 32.5px";
        target.append(button);
        oninit(button)
    }, false);
}

function copyJiraKeyAndDescriptionToClip(button) {
    let jiraKeyDesc = document.title;
    let key = jiraKeyDesc.match(/\[(.*)\]/)[1];
    let desc = jiraKeyDesc.match(/\] (.+) - /)[1];
    toClipboard(key + ' - ' + desc);

}

function initCopyJiraKeyAndDescriptionToClip(button)
{
    var qq = button.innerHTML;
    window.addEventListener('keydown', e=> {
        if (e.ctrlKey)
        {
            //button.innerHTML = "Remember parent";
        }
    });
    window.addEventListener('keyup', ()=>{
        //button.innerHTML = qq;
    })
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
