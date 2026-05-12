const fs = require("fs");
const path = require("path");

const DEFAULT_RATE = 83.0;
const DEFAULT_INPUT = path.join(__dirname, "updated_main.csv");

function splitCsvLine(line) {
	const result = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === "," && !inQuotes) {
			result.push(current);
			current = "";
			continue;
		}

		current += char;
	}

	result.push(current);
	return result;
}

function toCsvValue(value) {
	const str = String(value ?? "");
	const needsQuotes = /[",\n\r]/.test(str);
	if (!needsQuotes) {
		return str;
	}
	return `"${str.replace(/"/g, '""')}"`;
}

function formatMoney(value) {
	if (!Number.isFinite(value)) {
		return "";
	}
	return value.toFixed(2).replace(/\.00$/, "");
}

function updateCurrencyInCsv(csvData, rate, currencyLabel) {
	const lines = csvData.split(/\r?\n/).filter((line) => line.length > 0);
	if (lines.length === 0) {
		return csvData;
	}

	const headerLine = lines[0];
	const headers = splitCsvLine(headerLine);
	const priceIndex = headers.indexOf("price");
	const oldPriceIndex = headers.indexOf("old_price");
	const currencyIndex = headers.indexOf("currency");

	if (priceIndex === -1 || currencyIndex === -1) {
		throw new Error("CSV must include price and currency columns.");
	}

	const outputLines = [headerLine];

	for (let i = 1; i < lines.length; i++) {
		const row = splitCsvLine(lines[i]);

		if (row[currencyIndex] === "$" || row[currencyIndex] === "USD") {
			const priceValue = Number.parseFloat(row[priceIndex]);
			const oldPriceValue = Number.parseFloat(row[oldPriceIndex]);

			if (Number.isFinite(priceValue)) {
				row[priceIndex] = formatMoney(priceValue * rate);
			}

			if (Number.isFinite(oldPriceValue)) {
				row[oldPriceIndex] = formatMoney(oldPriceValue * rate);
			}

			row[currencyIndex] = currencyLabel;
		}

		const serialized = row.map((value) => toCsvValue(value));
		outputLines.push(serialized.join(","));
	}

	return outputLines.join("\n") + "\n";
}

function updateFile(options = {}) {
	const inputPath = options.inputPath || DEFAULT_INPUT;
	const outputPath = options.outputPath || inputPath;
	const rate = Number(options.rate ?? DEFAULT_RATE);
	const currencyLabel = options.currencyLabel || "INR";

	if (!Number.isFinite(rate) || rate <= 0) {
		throw new Error("Rate must be a positive number.");
	}

	const csvData = fs.readFileSync(inputPath, "utf-8");
	const updated = updateCurrencyInCsv(csvData, rate, currencyLabel);
	fs.writeFileSync(outputPath, updated, "utf-8");
}

if (require.main === module) {
	const rateArg = process.argv[2];
	const outputArg = process.argv[3];
	const currencyArg = process.argv[4];

	updateFile({
		rate: rateArg,
		outputPath: outputArg,
		currencyLabel: currencyArg,
	});
}

module.exports = {
	updateCurrencyInCsv,
	updateFile,
};
