const raidValues = [];
const classicValues = [];
const kunarkValues = [];

module.exports = {
	readEncountersValues: async (channel) => {
		const encounters = await channel.messages.fetch({ limit: 100 });
		const raidMsg = encounters.find(message => message.content.includes('[RAID]'));
		if (raidMsg) {
			processEncontersValues(raidMsg.content, raidValues);
		}
		const classicMsg = encounters.find(message => message.content.includes('[CLASSIC]'));
		if (classicMsg) {
			processEncontersValues(classicMsg.content, classicValues);
		}
		const kunarkMsg = encounters.find(message => message.content.includes('[KUNARK]'));
		if (kunarkMsg) {
			processEncontersValues(kunarkMsg.content, kunarkValues);
		}
	},
	getEncounterByName: (encounter) => {
		const raidValue = raidValues.find(e => e.encounter === encounter);
		if (raidValue) {
			return {name: raidValue.encounter, dkp: raidValue.dkp, era: 'raid'};
		}
		const classicValue = classicValues.find(value => value.encounter === encounter);
		if (classicValue) {
			return {name: classicValue.encounter, dkp: classicValue.dkp, era: 'classic'};
		}
		const kunarkValue = kunarkValues.find(value => value.encounter === encounter);
		if (kunarkValue) {
			return {name: kunarkValue.encounter, dkp: kunarkValue.dkp, era: 'kunark'};
		}
		return 0;
	},
	getEncountersNameList: () => {
		const encounters = [];
		classicValues.forEach(e => encounters.push(e.encounter));
		kunarkValues.forEach(e => encounters.push(e.encounter));
		return encounters;
	}
};

function processEncontersValues(content, valuesArray) {
	const lines = content.split('\n');
	lines.forEach((line) => {
		if (line.includes('DKP')) {
			const splitLine = line.split(':');
			const label = trimSpecialChars(splitLine[0]);
			const dkp = parseInt(trimDKPss(splitLine[1]));
			valuesArray.push({ encounter: label, dkp: dkp });
		}
	});
}

function trimSpecialChars(str) {
	return str.replace(/^[•\s]+|[•\s]+$/g, '');
}

function trimDKPss(str) {
	return str.replace(/^[•\s]*DKP\s*|[•\s]*DKP\s*$/g, '').trim();
}