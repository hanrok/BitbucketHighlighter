var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function(obj, callback) {
    if( !obj || !obj.nodeType === 1 ) return; // validation

    if (MutationObserver) {
      // define a new observer
      var obs = new MutationObserver(function(mutations, observer){
          callback(mutations);
      })
      // have the observer observe foo for changes in children
      obs.observe( obj, { childList:true, subtree:true });
    }

    else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();

function is_changed_by_me(codeLines, m) {
	for (let changedMutation of m) {
		if (changedMutation.target == codeLines[0].lastElementChild) {
			return true;
		}
	}
	return false;
}

function highlightCode(m) {
	let codeLines = document.querySelectorAll("[data-qa=code-line]");
	if (codeLines.length === 0) {
		return;
	}

	if (is_changed_by_me(codeLines, m)) {
		return;
	}

	for (let e of codeLines) {
		let codeElement = e.lastElementChild;
		codeElement.style.display = "block";
		codeElement.innerHTML = Prism.highlight(codeElement.innerText, Prism.languages.python);
	}
}

let codeRoot = document.getElementById('root').firstElementChild.firstElementChild.firstElementChild.firstElementChild;
observeDOM(codeRoot, highlightCode);
