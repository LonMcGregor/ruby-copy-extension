Array.from(document.querySelectorAll(".test")).forEach(test => {
    if(test.classList.has("fwd")){
        window.getSelection.setBaseAndExtent(anchorNode,anchorOffset,focusNode,focusOffset);
    } else {
        window.getSelection.setBaseAndExtent(anchorNode,anchorOffset,focusNode,focusOffset);
    }
    try{
        const resultmain = injectedScript(true);
        const outcomemain = resultmain===test.querySelector(".expectmain").innerText;
        test.querySelector(".outmain").innerText = resultmain;

        const resultanno = injectedScript(false);
        const outcomeanno = resultanno===test.querySelector(".expectanno").innerText;
        test.querySelector(".outanno").innerText = resultanno;

        test.querySelector(".outcome").classList.add((outcomemain && outcomeanno) ? "pass" : "fail");
        test.querySelector(".outcome").innerText = (outcomemain && outcomeanno) ? "pass" : "fail";
    } catch {
        test.querySelector(".outcome").classList.add("fail");
        test.querySelector(".outcome").innerText = "EXCEPTION";
    }
});
