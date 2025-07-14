// ==UserScript==
// @name         Jira Cloud extensions
// @namespace    http://tampermonkey.net/
// @version      0.9.1
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
    console.log("JiraCloudExtensions start");
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
        waitForKeyElements('.css-stv1n7', target => {
            var clipIcon = getButtonIcon("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAWQAAAFkBqp2phgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACwSURBVDiN7dMxSgNhFATgb2TB1LZuYZkjeAQP4wG8k7cQAjb22yeVYGGwCCL8aTay2d0fSbDMwMDPY/73Zh48pRRzxA1e8Ibbmu7KDJJ0+MAKz9gkWSdpJuLBxEd8ovS8Hjna9fUvPP3WB4J3LPt3N2h04BoNWmzRjBvssKhlnXGzqO7gFEwaJLlPUip8GOsnWy2lvCJnOzgVlwj/HGGLu78+JGnxjZ/DxNox1Xh0THt8X7kBq8F2ugAAAABJRU5ErkJggg==");
            addToolbarButton(target, clipIcon + 'To clipboard', copyJiraKeyAndDescriptionToClip, initCopyJiraKeyAndDescriptionToClip);
            var gitIcon = getButtonIcon("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADSSURBVDiNpdK9TgJhEIXhB/mxorYwbCxILMwWJLbCDVhxE7YY7kdq5AJoqLgBGkKjhaIJnQUVJcX3JZINsux6ujmZeXMmM/xT1SNeD318Y1sU2MMGL/hEI2/gIlPfY4onNHEV/Rae0c0DtvCFH4yjd4l1TLU5B5JidVAnEVjHCMM8wB2WGW8SIeuYsjCAsNpt1qz9AWngEW3coCOc9S3bWDmRYI4FPvCOGXanwwelMW4pJX7P+FoGMBTuXY+QpCigKzzLSNg995WP6QEDXJcZLqw9RfYnK1Vve5AAAAAASUVORK5CYII=");
            addToolbarButton(target, gitIcon + 'Git branch to clipboard', copyBanchNameToClip);
            return false;
        }, true);
        addCollapseRightPanelButton();
    }
})();

function getButtonIcon(base64){
    return '<img style="position: relative; top: 2px; margin-right:5px" src="data:image/png;base64,'+base64+'">';
}

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

function addToolbarButton(target, text, onclick, oninit) {
    let button = document.createElement('button');
    button.innerHTML = text;
    button.onclick = () => onclick(button);
    button.onsubmit = () => { };
    button.className = "css-1pxwk5s";
    button.style = "height: 32.5px";
    target.append(button);
    oninit?.(button);
}

function copyJiraKeyAndDescriptionToClip(button) {
    let jiraKeyDesc = document.title;
    let key = jiraKeyDesc.match(/\[(.*)\]/)[1];
    let desc = jiraKeyDesc.match(/\] (.+) - /)[1];
    toClipboard(key + ' - ' + desc);

}

function copyBanchNameToClip(button) {
    let jiraKeyDesc = document.title;
    let key = jiraKeyDesc.match(/\[(.*)\]/)[1];
    let desc = jiraKeyDesc.match(/\] (.+) - /)[1];
    let branchName =toSafeGitBranchName(key + '-' + desc)
    toClipboard(branchName);

}

function toSafeGitBranchName(text) {
  if (typeof text !== 'string') {
    return '';
  }

  const diacriticMap = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a',
    'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e',
    'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'ù': 'u',
    'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y',
    'œ': 'oe', 'Œ': 'OE',
    'Š': 'S', 'š': 's',
    'Ž': 'Z', 'ž': 'z',
    '¥': 'Yen',
    '£': 'Pound',
    '€': 'Euro',
    '©': 'Copyright',
    '®': 'Registered',

    // Czech diacritics added
    'Č': 'C', 'č': 'c',
    'Ď': 'D', 'ď': 'd',
    'Ě': 'E', 'ě': 'e',
    'Ň': 'N', 'ň': 'n',
    'Ř': 'R', 'ř': 'r',
    'Ť': 'T', 'ť': 't',
    'Ů': 'U', 'ů': 'u',
  };

  let normalizedText = text.replace(/./g, char => diacriticMap[char] || char);

  let safeName = normalizedText.replace(/[^a-zA-Z0-9_.-]/g, '-');
  safeName = safeName.replace(/^-+|-+$/g, '').replace(/-+/g, '-');

  if (safeName.length > 200) {
    safeName = safeName.substring(0, 200);
    safeName = safeName.replace(/-+$/g, '');
  }

  return safeName;
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

    showPopup('"' + text + '" copied to clipboard!');
}

function showPopup(text) {
  // Create the popup element
  const popup = document.createElement('div');
  popup.textContent = text;
  popup.style.position = 'fixed';
  popup.style.bottom = '50px'; // Adjust as needed
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark background
  popup.style.color = 'white';
  popup.style.padding = '10px 20px';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000'; // Make sure it's on top
  popup.style.opacity = '0'; // Start invisible
  popup.style.transition = 'opacity 0.3s ease-in-out'; // Smooth fade

  // Append to the body
  document.body.appendChild(popup);

  // Fade in
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 10);

  // Fade out and remove after a delay
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300); // Match the fade-out transition duration
  }, 2000); // Display for 2 seconds (adjust as needed)
}

