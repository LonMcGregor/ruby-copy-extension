chrome.contextMenus.create({
    "type": "normal",
    "id": "lonm-ruby-copy-main",
    "title": chrome.i18n.getMessage("copymain"),
    "contexts": ["selection"]
});
chrome.contextMenus.create({
    "type": "normal",
    "id": "lonm-ruby-copy-annotation",
    "title": chrome.i18n.getMessage("copyanno"),
    "contexts": ["selection"]
});

// injct this script onto the page
// replace the BLAH with a recursive function first
function injectedScript(){
    debugger; // being in dev console prevents copy script from working

    // Process the elements, including only RTs when inside RUBY
    function processElementRecursiveRTOnly(element){
        if(element.nodeName==="#text"){
            return element.textContent;
        } else if(element.nodeName.toUpperCase()==="RUBY") {
            let text = '';
            let children = Array.from(element.childNodes).filter(e => e.nodeName.toUpperCase()==="RT");
            children.forEach(child => {
                text = text + processElementRecursiveRTOnly(child);
            });
            return text;
        } else {
            let text = '';
            Array.from(element.childNodes).forEach(child => {
                text = text + processElementRecursiveRTOnly(child);
            });
            return text;
        }
    }

    // Process the elements, excluding RTs
    function processElementRecursiveExcludeRT(element){
        if(element.nodeName.toUpperCase()==="RT"){
            return "";
        } else if(element.nodeName==="#text"){
            return element.textContent;
        } else {
            let text = '';
            Array.from(element.childNodes).forEach(child => {
                text = text + processElementRecursiveExcludeRT(child);
            });
            return text;
        }
    }

    const processElementRecursive = BLAH; // this should be replaced when injecting script

    const s = window.getSelection();
    if(s.type.toLowerCase()!=="range"){
        return;
    }
    // get all selected elements
    // todo worry about offsets/partially selected elements later
    // TODO what if the selection is backwards
    const selectionElements = [];
    let current = s.anchorNode;
    while(current != s.extentNode){
        // todo case where selection is within a single node
        selectionElements.push(current);
        current = current.nextSibling;
    }
    // DFS each element and remove any <rt> OR just get only <RT>s depending on the task at hand
    let selectionText = "";
    selectionElements.forEach(element => {
        selectionText = selectionText + processElementRecursive(element);
    })

    //https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    function copyToClipboard(str) {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =
          document.getSelection().rangeCount > 0        // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)     // Store selection if found
            : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
          document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
          document.getSelection().addRange(selected);   // Restore the original selection
        }
    }

    console.log(selectionText);
    copyToClipboard(selectionText);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId==="lonm-ruby-copy-main"){
        chrome.tabs.executeScript(tab.id, {
            code: `(${injectedScript.toString().replace("BLAH", "processElementRecursiveExcludeRT")})()`
        })
    } else if (info.menuItemId==="lonm-ruby-copy-annotation"){
        chrome.tabs.executeScript(tab.id, {
            code: `(${injectedScript.toString().replace("BLAH", "processElementRecursiveRTOnly")})()`
        })
    }
});
