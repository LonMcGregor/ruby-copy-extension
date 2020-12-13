/**
 * HOW TO TEST
 * 1. Copy the function from background script to below
 * 2. Add the argument BLAH
 * 3. Set this variable:
 * const processElementRecursive = BLAH ? processElementRecursiveExcludeRT : processElementRecursiveRTOnly;
 */
function injectedScript(BLAH){
    debugger; // being in dev console prevents copy script from working

    // this should be replaced when injecting script
    const processElementRecursive = BLAH ? processElementRecursiveExcludeRT : processElementRecursiveRTOnly;

    // Process the elements, including only RTs when inside RUBY
    function processElementRecursiveRTOnly(element, startel, startoff, endel, endoff){
        if(element.nodeName==="#text"){
            if(element==startel){
                return element.textContent.substr(startoff);
            }
            if(element==endel){
                return element.textContent.substr(0, endoff);
            }
            return element.textContent;
        } else if(element.nodeName.toUpperCase()==="RUBY") {
            let text = '';
            let children = Array.from(element.childNodes).filter(e => e.nodeName.toUpperCase()==="RT");
            children.forEach(child => {
                text = text + processElementRecursiveRTOnly(child, startel, startoff, endel, endoff);
            });
            return text;
        } else {
            let text = '';
            Array.from(element.childNodes).forEach(child => {
                text = text + processElementRecursiveRTOnly(child, startel, startoff, endel, endoff);
            });
            return text;
        }
    }

    // Process the elements, excluding RTs
    function processElementRecursiveExcludeRT(element, startel, startoff, endel, endoff){
        if(element.nodeName.toUpperCase()==="RT"){
            return "";
        } else if(element.nodeName==="#text"){
            if(element==startel){
                return element.textContent.substr(startoff);
            }
            if(element==endel){
                return element.textContent.substr(0, endoff);
            }
            return element.textContent;
        } else {
            let text = '';
            Array.from(element.childNodes).forEach(child => {
                text = text + processElementRecursiveExcludeRT(child, startel, startoff, endel, endoff);
            });
            return text;
        }
    }

    const s = window.getSelection();
    if(s.type.toLowerCase()!=="range"){
        return;
    }
    // get all selected elements
    const selectionElements = [];
    let startel;
    let endel;
    let startoff;
    let endoff;
    if(s.anchorNode.compareDocumentPosition(s.focusNode) & Node.DOCUMENT_POSITION_PRECEDING){
        // Backwards
        let current = s.focusNode;
        starel = s.focusNode;
        startoff = s.focusOffset;
        endel = s.anchorNode;
        endoff = s.anchorOffset;
        // It is not reached start of selection, or a sub-node within selection
        while(current != s.anchorNode && !(s.anchorOffset > 0 && s.anchorNode.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_CONTAINS)){
            selectionElements.push(current);
            current = current.nextSibling;
        }
        selectionElements.push(current);
    } else {
        // Forwards
        let current = s.anchorNode;
        startel = s.anchorNode;
        startoff = s.anchorOffset;
        endel = s.focusNode;
        endoff = s.focusOffset;
        // It is not reached end of selection or reached a parent node of end of selection
        while(current != s.focusNode && !(s.focusOffset> 0 && s.focusNode.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_CONTAINS)){
            selectionElements.push(current);
            current = current.nextSibling;
        }
        selectionElements.push(current);
    }
    // DFS each element and remove any <rt> OR just get only <RT>s depending on the task at hand
    let selectionText = "";
    selectionElements.forEach(element => {
        selectionText = selectionText + processElementRecursive(element, startel, startoff, endel, endoff);
    })

    // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    // CC-0 https://github.com/30-seconds/30-seconds-of-code/blob/master/LICENSE
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
    return selectionText;
}
