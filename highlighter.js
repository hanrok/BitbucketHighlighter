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

fileExtensions = {
	'js': 'javascript',
	'py': 'python',
	'rb': 'ruby',
	'ps1': 'powershell',
	'psm1': 'powershell',
	'sh': 'bash',
	'bat': 'batch',
	'h': 'clike',
	'tex': 'latex',
	'c': 'clike',
	'cpp': 'clike',
	'ts': 'javascript',
	'css': 'css',
	'scss': 'css'
};

function getFileNameOfCodeLine(codeLineElement) {
	let parent = codeLineElement.parentElement;
	while (true) {
		parent = parent.parentElement;
		if (parent.getAttribute('data-qa') !== null && parent.getAttribute('data-qa') == 'pr-diff-file-styles') {
			return parent.firstElementChild.firstElementChild.innerText;
		} else if (parent.id === 'root') {
			return null;
		}
	}
}

function getCodeLanguage(codeLineElement) {
	let filename = getFileNameOfCodeLine(codeLineElement);
	let fileExtension = filename.split('.')[filename.split('.').length - 1];

	if (fileExtension in fileExtensions) {
		return fileExtensions[fileExtension];
	}

	return null;
}

function isChangedByMe(codeLines, m) {
	for (let changedMutation of m) {
		if (changedMutation.target == codeLines[0].lastElementChild) {
			return true;
		}
	}
	return false;
}

function isComment(codeElement) {
	return (codeElement.querySelectorAll('div>div>div>div>span>span[role=img]').length !== 0) ||
		(codeElement.querySelectorAll("div[id^=comment]").length !== 0);
}

function highlightBlockOfCode(codeLines) {
	if (codeLines.length === 0) {
		return;
	}

	for (let e of codeLines) {
		let codeElement = e.lastElementChild;
		if (isComment(codeElement)) {
			continue;
		}
		let lang = getCodeLanguage(codeElement) || 'markup';
		codeElement.style.display = "block";
		codeElement.innerHTML = Prism.highlight(codeElement.innerText, Prism.languages[lang]);
	}

}

function highlightCode(mutations) {
	for (m of mutations) {
		highlightBlockOfCode(m.target.querySelectorAll('[data-qa=code-line]'));
	}
}


let codeRoot = document.getElementById('root').firstElementChild.firstElementChild.firstElementChild.firstElementChild;
observeDOM(codeRoot, highlightCode);
highlightBlockOfCode(codeRoot.querySelectorAll('[data-qa=code-line]'))
