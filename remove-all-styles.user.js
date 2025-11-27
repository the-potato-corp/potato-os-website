// ==UserScript==
// @name         Remove All Styles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes all styles (inline, external, <style> tags) from the document and monitors for changes
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
	'use strict';

	// Function to remove all styles from the document
	function removeAllStyles() {
		// Remove all <style> tags
		const styleTags = document.querySelectorAll('style');
		styleTags.forEach(tag => tag.remove());

		// Remove all <link> tags with rel="stylesheet"
		const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
		linkTags.forEach(tag => tag.remove());

		// Remove all inline styles from elements
		const allElements = document.querySelectorAll('*');
		allElements.forEach(element => {
			if (element.hasAttribute('style')) {
				element.removeAttribute('style');
			}
		});
	}

	// Initial removal
	removeAllStyles();

	// Run again when DOM is fully loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', removeAllStyles);
	}

	// Create a MutationObserver to watch for changes
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			// Check for added nodes
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === 1) { // Element node
					// Remove if it's a style or link tag
					if (node.tagName === 'STYLE' || 
						(node.tagName === 'LINK' && node.rel === 'stylesheet')) {
						node.remove();
					}
					// Remove inline styles from the added element
					if (node.hasAttribute && node.hasAttribute('style')) {
						node.removeAttribute('style');
					}
					// Remove inline styles from children
					if (node.querySelectorAll) {
						const styledElements = node.querySelectorAll('[style]');
						styledElements.forEach(el => el.removeAttribute('style'));
					}
				}
			});

			// Check for attribute changes (inline style modifications)
			if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
				if (mutation.target.hasAttribute('style')) {
					mutation.target.removeAttribute('style');
				}
			}
		});
	});

	// Start observing the document
	const config = {
		childList: true,       // Watch for added/removed nodes
		subtree: true,         // Watch all descendants
		attributes: true,      // Watch for attribute changes
		attributeFilter: ['style'] // Only watch style attribute changes
	};

	// Start observing when the document is available
	if (document.body) {
		observer.observe(document.body, config);
	} else {
		// If body doesn't exist yet, wait for it
		const startObserver = setInterval(() => {
			if (document.body) {
				observer.observe(document.body, config);
				clearInterval(startObserver);
			}
		}, 100);
	}

	// Also observe the head for stylesheet additions
	if (document.head) {
		observer.observe(document.head, config);
	}

	// Periodic cleanup as a fallback (every 500ms)
	setInterval(removeAllStyles, 500);

})();
