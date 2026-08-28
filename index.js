const expertToggle = document.querySelector('#expert-check');
const levelCapToggle = document.querySelector('#lvl-cap-check');
const highLevelToggle = document.querySelector('#high-lvl-check');
const levelingToggle = document.querySelector('#lvling-check');
const trialsToggle = document.querySelector('#trials-check');
const mainScenarioToggle = document.querySelector('#ms-check');
const guildhestsToggle = document.querySelector('#gh-check');
const allianceRaidToggle = document.querySelector('#alliance-check');
const normalRaidToggle = document.querySelector('#normal-raid-check');
const frontlineToggle = document.querySelector('#frontline-check');

const rollBtn = document.querySelector('#roll-btn');

const toggles = Array.from(document.querySelectorAll("input[type='checkbox']"));

const bannerContainer = document.querySelector('#roulette-random-picker');

const children = Array.from(bannerContainer.children);
let visibleRoulettes = children.filter((ele) => ele.checkVisibility());

const selector = document.querySelector('#selector');
let timeout = null;

const togglesObj = {};

const rollSound = './assets/roll.mp3';
const selectSound = new Audio('./assets/select.mp3');
selectSound.volume = 0.40;

init();

function init() {
	toggles.forEach((item, index) => {
		togglesObj[`toggle${index}`] = item.checked;
		item.addEventListener('change', (event) => {
			toggleRouletteVisibility(children[index], event.target.checked);
			resetVisuals();
			toggleSelector(false);
			togglesObj[`toggle${index}`] = item.checked;
			localStorage.setItem('toggles', JSON.stringify(togglesObj));
		});
	});

	if (localStorage.getItem('toggles') === null) {
		localStorage.setItem('toggles', JSON.stringify(togglesObj));
	}

	let ls = JSON.parse(localStorage.getItem('toggles'));

	children.forEach((ele, index) => {
		toggleRouletteVisibility(ele, ls[`toggle${index}`]);
	});

	enableRollButton();

	rollBtn.addEventListener('click', () => {
		if (timeout) clearTimeout(timeout);
		visibleRoulettes = children.filter((ele) => ele.checkVisibility());
		resetVisuals();
		rollRandomSelection();
	});
}

function toggleRouletteVisibility(roulette, isOn) {
	roulette.style.setProperty('display', isOn ? 'flex' : 'none');
}

function toggleSelector(isVisible) {
	selector.style.setProperty('visibility', isVisible ? 'visible' : 'collapse');
}

function moveSelector(pos) {
	let offset = 10;
	selector.style.left = `${pos.left - (selector.getBoundingClientRect().width + offset)}px`;
	selector.style.top = `${pos.top}px`;
}

function highlightRoulette(roulette) {
	roulette.classList.add('highlight');
}

function removeBoxShadow() {
	visibleRoulettes.forEach((ele) => {
		ele.classList.remove('highlight');
	});
}

function resetVisuals() {
	removeBoxShadow();
	resetSelector();
}

function resetSelector() {
	let pos = visibleRoulettes[0].getBoundingClientRect();
	selector.style.top = `${pos.top}px`;
	selector.style.visibility = 'visible';
}

function rollRandomSelection() {
	let delay = 75;
	let positions = [];
	let iteration = 0;
	let index = 0;
	const stopAtLoop = 2;
	let loops = 0;

	disableRollButton();

	visibleRoulettes.forEach((item) => {
		positions.push(item.getBoundingClientRect());
	});
	let stopSelectionCounter = getRandomNumber(
		stopAtLoop * visibleRoulettes.length - visibleRoulettes.length,
		visibleRoulettes.length * stopAtLoop,
	);

	if (positions.length <= 1) {
		moveSelector(positions[index === positions.length ? 0 : index]);
		let sound = new Audio(rollSound);
		sound.volume = 0.40;
		sound.play();
		enableRollButton();

		setTimeout(() => {
			highlightRoulette(
				visibleRoulettes[index === positions.length ? 0 : index],
			);
			selectSound.play();
		}, 150);

		return;
	}

	timeout = setTimeout(function tick() {
		if (iteration % positions.length === 0) {
			index = 0;
			loops++;
		}

		iteration++;
		index++;
		moveSelector(positions[index === positions.length ? 0 : index]);
		let sound = new Audio(rollSound);
		sound.play();

		if (iteration >= stopSelectionCounter - visibleRoulettes.length) {
			timeout = setTimeout(tick, (delay *= 1.25));
			if (delay > 500) {
				clearTimeout(timeout);

				enableRollButton();
				setTimeout(() => {
					highlightRoulette(
						visibleRoulettes[index === positions.length ? 0 : index],
					);
					selectSound.play();
				}, 150);
				return;
			}
		} else {
			timeout = setTimeout(tick, delay);
		}
	}, delay);
}

function enableRollButton() {
	rollBtn.disabled = false;
	rollBtn.textContent = 'Commence';
}

function disableRollButton() {
	rollBtn.disabled = true;
	rollBtn.textContent = 'Commencing...';
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * max) + min;
}
