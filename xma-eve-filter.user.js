// ==UserScript==
// @name         XMA Eve Filter
// @namespace    xma-eve-filter
// @version      1.0.1
// @author       goosemasseuse a.k.a. Foxxy
// @description  Hide xivmodarchive results that exclude the Eve body; keep ones made for it
// @match        https://www.xivmodarchive.com/search*
// @match        https://www.xivmodarchive.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      xivmodarchive.com
// @run-at       document-idle
// @updateURL   https://raw.githubusercontent.com/goosemasseuse/xma-eve-filter/main/xma-eve-filter.user.js
// @downloadURL https://raw.githubusercontent.com/goosemasseuse/xma-eve-filter/main/xma-eve-filter.user.js
// ==/UserScript==

(function() {
	'use strict';

	// ====================================================================
	//  USER SETTINGS — edit these to taste.
	// ====================================================================

	// Delete flagged cards entirely (true) or just gray them out (false).
	const REMOVE = false;

	// Trusted Eve creators — ALWAYS shown, no matter what. Add names exactly
	// as they appear after "By:" on the card, in quotes, comma-separated.
	const AUTHOR_WHITELIST = [
		'Nyaughty',
		'Acja',
		'Acja, but on a potato',
		'Ak1Z',
    	'Ami',
		'Amiza',
    	'Ane',
		'Applenzo | Holo',
		'arashiv',
		'arohk',
		'ascy',
    	'Cakeday',
    	'Chameleon',
    	'ciphernine',
		'Cordelia',
		'Daemon115',
		'daoko',
		'Dera',
		'didxiv',
		'ephah',
    	'Helper Kato',
		'Hyades',
		'JadedFawx',
		'juvei1647',
		'Karlam3D',
		'Liberty',
    	'Lua',
		'Midori',
		'nyiam',
		'obligational',
		'Okami Strife',
    	'P4TZY42',
		'pyrowind',
		'Quartz',
		'quinnzie',
    	'RakuEkiFF',
		'Reqrider (retired)',
		'riven2319',
		'Scherana [The Moon] 3D',
    	'Sebby',
		'sephodious',
		'Serenity',
		'Shana',
		'SillyTaiga',
		'SkibidiCatte (Taiga)',
    	'Sophie Moonway',
		'spiswel',
    	'TaigaIria',
		'teka',
		'thicciechan',
		'TightFits',
		'ulli',
		'Valkyrie',
		'versk4886',
    	'Yaelle Cry',
		'YordleIRL',
    	'Yuma',
    	'zfrantic',
    	'\\(^w^)/ Miku \\(^w^)/',
		'zaushka',
		'⚠ Eʀʀᴏʀ ― G0TH',
		// 'A Trusted Author Name',
	];

	// Known anti-Eve authors — hidden instantly, no page fetch. Same format.
	const AUTHOR_BLACKLIST = [
		'.faewind',
		'_cota',
		'AC',
		'aeryn_ffxiv',
		'alee',
    	'Alma Apple (otlpotato)',
		'And The Jackal Said',
		'auraurify',
    	'Bacara',
    	'Baelsar',
		'Bladed Designs',
		'bloodmoon.mods',
    	'bluberry',
		'Blxssfall',
    	'bwia',
		'camillas_heart',
		'carnivoyeur',
    	'cawamewon',
    	'Cinnabun',
		'𝕮𝖔𝖗𝖕𝖘𝖊 𝕻𝖗𝖎𝖓𝖈𝖊𝖘𝖘',
		'Cree Umlone',
		'cultist',
		'Cyr',
		'Dak\'kon Blackblade',
    	'dalamudred',
		'dia',
		'einherjars',
		'Euphoria Mods',
		'existench',
		'fenn_odonnell',
		'fisheverlasting',
    	'gaylentines',
		'grave',
    	'gremmygore',
		'HANZO DOJO',
		'Haru',
		'hex.adecimal',
    	'hilde',
    	'hirun',
    	'hodcucku',
		'illydoesthings',
		'izayoi',
		'jaci',
		'juno',
    	'Kai/Kashy',
		'Katami ☆',
		'katasterismoi',
		'Kenzo',
    	'Khloris',
    	'Kirch (Cherry Icecream)',
		'Kyary',
		'Ladexo',
    	'Laululintu',
		'Leopard',
		'Lily',
    	'LUCILIAS',
    	'Luneie',
		'Lux | Huria',
		'miffy.uwu',
		'MilkBunMods',
		'Millwood',
    	'Morii ୨୧',
    	'My\'rie',
		'nevereatdirt',
		'nymunymu',
		'Nilla',
		'oneiroy',
	    'palaydin',
		'peachhwi',
		'polyhexed',
		'prayer',
    	'Reiry',
		'Ril',
		'Rina | FuathQueen',
    	'ritualgoth',
		'RunnyNoseArk',
    	'Skadi☠︎︎',
    	'Snow Kitsune Mods',
    	'starfallsun',
		'STARSHOOTER mods',
    	'sulls',
    	'sunrotea',
		'tricklingg',
		'valorakujo',
		'Verotter',
		'Yuki',
		'zephyr.mods',
    	'♱𝖣𝖤𝖠𝖳𝖧𝖬𝖮𝖳𝖧♱',
		// 'Some Hostile Author Name',
	];

	// Only filter out gear mods? false = filter every type (hair, minion, etc.).
	// Default false: a search for "eve" usually only wants gear anyway, so
	// hiding non-gear noise too is generally helpful.
	const GEAR_ONLY = false;
	const GEAR_TYPES = ['gear']; // which card "Type:" values count as gear

	// --- Feature toggles ---
	// These 2 should almost always be set to true (ON).
	// Turning one off will lead to weaker, less accuate filtering
	// Turning both off effectively disables the script
	const ENABLE_AUTHOR_BLACKLIST = true; // hide mods by blacklisted authors outright
	const ENABLE_PATTERN_BLOCKING = true; // hide mods whose description excludes Eve

	// ====================================================================
	//  ⛔  DO NOT EDIT BELOW THIS LINE  ⛔
	//  (unless you know what you're doing — this is the detection engine)
	// ====================================================================

	const ANTI_EVE_PATTERNS = [
		/\bno\b[^a-z]{0,3}\beve\b/,
		/\bno\b[^.]{0,20}\bport\w*[^.]{0,15}\b(to|for|over)?\b[^.]{0,10}\beve\b/,
		/\beve\b[^.]{0,20}\bno\b[^.]{0,15}\bport/,
		/\bexcept\b[^.]*\beve\b/,
		/\bexcluding\b[^.]*\beve\b/,
		/\bexclude\b[^.]*\beve\b/,
		/\beve\b[^.]*\bexcluded\b/,
		/\b(do not|don'?t|dont|no|never|please no|prefer no)\b[^.]{0,60}\b(port|convert|upscale|adapt|put)\w*[^.]{0,60}\beve\b/,
		/\b(port|convert|upscale|adapt)\w*[^.]{0,60}\beve\b[^.]{0,30}\b(not allowed|prohibited|forbidden|banned|not permitted)\b/,
		/\beve\b[^.]{0,40}\b(not allowed|prohibited|forbidden|banned|not permitted)\b/,
		/\bprefer\b[^.]{0,40}\bno\b[^.]{0,40}\beve\b/,
	];

	const LINE_PRO_PATTERNS = [
		/\bfor eve\b/,
		/\beve\b[^.]{0,20}\bshould be used\b/,
		/built on the eve\b/,
		/\beve\b[^.]{0,8}(body )?layout\b/,
		/\b(need|needs|requires|required)\b[^.]{0,20}\beve\b/,
		/\beve\b\s*\d/,
		/\beve\b[^.]{0,15}\b(justice|milky|normal|small|medium|large)\b/,
		/do not wish to use eve/,
		/don'?t wish to use eve/,
		/if you do not (use|have|wish) eve/,
	];

	const LIST_HEADER_PATTERNS = [
		/\b(do not|don'?t|dont|no|never|may not|cannot|can'?t|you may not)\b[^.]{0,40}\b(port|upscale|convert|adapt)\w*[^.]{0,40}\b((the )?following|bodies)\b/,
		/\b(do not|don'?t|dont|you may not|may not|cannot|can'?t)\b\s*[:\-–—]?\s*$/,
	];
	const LIST_LOOKAHEAD = 15;
	const LIST_ITEM_EVE = /\beve\b/;

	const PATTERN_VERSION = 12;
	const FETCH_DELAY_MS = 350;

	const CACHE_KEY = 'xma_eve_cache_v' + PATTERN_VERSION;
	const CACHE = JSON.parse(GM_getValue(CACHE_KEY, '{}'));
	const saveCache = () => GM_setValue(CACHE_KEY, JSON.stringify(CACHE));

	const EVE = /\beve\b/i;
	const whitelistedAuthors = new Set(AUTHOR_WHITELIST.map(a => a.trim().toLowerCase()));
	const blacklistedAuthors = new Set(AUTHOR_BLACKLIST.map(a => a.trim().toLowerCase()));
	const gearTypes = new Set(GEAR_TYPES.map(t => t.toLowerCase()));

	function getCardType(card) {
		const codes = card.querySelectorAll('code');
		for (const c of codes) {
			const m = c.textContent.match(/type:\s*(\w+)/i);
			if (m) return m[1].toLowerCase();
		}
		return '';
	}

	function classifyLines(lines) {
		let sawPro = false;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (!EVE.test(line)) {
				if (LIST_HEADER_PATTERNS.some(re => re.test(line))) {
					for (let j = i + 1; j <= i + LIST_LOOKAHEAD && j < lines.length; j++) {
						if (LIST_ITEM_EVE.test(lines[j])) return 'anti';
					}
				}
				continue;
			}
			if (ANTI_EVE_PATTERNS.some(re => re.test(line))) return 'anti';
			if (LINE_PRO_PATTERNS.some(re => re.test(line))) sawPro = true;
		}
		return sawPro ? 'pro' : 'neutral';
	}

	function extractLines(doc) {
		const info = doc.querySelector('#info');
		if (!info) return [];
		const html = info.innerHTML
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<\/(p|div|li|h\d)>/gi, '\n')
			.replace(/<li[^>]*>/gi, '\n');
		const tmp = document.createElement('div');
		tmp.innerHTML = html;
		return tmp.textContent
			.split('\n')
			.map(l => l.toLowerCase().replace(/\s+/g, ' ').trim())
			.filter(l => l.length > 0);
	}

	function classify(doc) {
		const lines = extractLines(doc);
		const verdict = classifyLines(lines);
		if (verdict !== 'neutral') return verdict;
		const tagged = [...doc.querySelectorAll('a[href*="tags="]')]
			.some(a => /\beve\b/i.test(a.textContent));
		if (tagged) return 'pro';
		return lines.some(l => EVE.test(l)) ? 'pro' : 'neutral';
	}

	function fetchDoc(url) {
		return new Promise((res, rej) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				timeout: 15000,
				onload: r => res(new DOMParser().parseFromString(r.responseText, 'text/html')),
				onerror: rej,
				ontimeout: rej,
			});
		});
	}

	function hide(card, reason) {
		if (REMOVE) {
			(card.closest('.col-4') || card).style.display = 'none';
			return;
		}
		card.style.opacity = '0.2';
		card.style.filter = 'grayscale(1)';
		card.style.outline = '2px solid #c0392b';
		const tag = document.createElement('div');
		tag.textContent = reason;
		tag.style.cssText = 'background:#c0392b;color:#fff;font-size:11px;padding:2px 4px;text-align:center;';
		card.prepend(tag);
	}

	async function processCard(card) {
		if (card.dataset.eveProcessed) return;
		card.dataset.eveProcessed = '1';

		const titleEl = card.querySelector('h5.card-title');
		const linkEl = card.querySelector('a[href^="/modid/"]');
		const authorEl = card.querySelector('p.card-text a[href^="/user/"]');
		if (!titleEl || !linkEl) return;

		if (GEAR_ONLY && !gearTypes.has(getCardType(card))) return;

		const author = authorEl ? authorEl.textContent.trim().toLowerCase() : '';

		if (author && whitelistedAuthors.has(author)) return;

		if (ENABLE_AUTHOR_BLACKLIST && author && blacklistedAuthors.has(author)) {
			hide(card, 'Hidden: excludes Eve (blacklisted author)');
			return;
		}

		const title = (titleEl.getAttribute('title') || titleEl.textContent).trim();
		const url = linkEl.href;

		if (EVE.test(title)) return;
		if (!ENABLE_PATTERN_BLOCKING) return;

		if (url in CACHE) {
			if (CACHE[url] === 'anti') hide(card, 'Hidden: excludes Eve (cached)');
			return;
		}

		try {
			const verdict = classify(await fetchDoc(url));
			CACHE[url] = verdict;
			saveCache();
			if (verdict === 'anti') hide(card, 'Hidden: excludes Eve');
		} catch (e) {
			/* leave visible on error */ }
		await new Promise(r => setTimeout(r, FETCH_DELAY_MS));
	}

	async function processAll() {
		for (const card of document.querySelectorAll('div.mod-card')) {
			await processCard(card);
		}
	}

	processAll();
	const target = document.querySelector('#search-results') || document.body;
	new MutationObserver(() => processAll()).observe(target, {
		childList: true,
		subtree: true
	});
})();
