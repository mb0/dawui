export const msMin = 60 * 1000
export const msHour = 60 * msMin
export const msDay = 24 * msHour
export const msWeek = 7 * msDay

export function parseTime(s:string):Date|null {
	let split = splitStr(s)
	let ts = parseDate(split.date)
	if (!ts) return null
	ts += isoTime(split.time)
	let tz = 0
	if (split.tz) {
		tz = tzOffset(split.tz)
	} else {
		tz = new Date(ts).getTimezoneOffset()
	}
	return new Date(ts + tz * msMin)
}

function splitStr(s?:string) {
	let m = s!.match(/^([0-9-.]+)(?:[ T]([0-9:.]+)(Z|[+-].*)?)?$/)
	if (!m) return {data: "", time: "", tz: ""}
	return {date: m[1], time: m[2], tz: m[3]}
}

const zeros = "00000000000000000"
const isoDateRe = /^(\d\d\d\d)(?:-(\d\d?)(?:-(\d\d?))?)?/
const isoTimeRe = /^(\d\d?)(?:[:](\d\d)(?:[:](\d\d)(?:[.](\d+))?)?)?/
const isoZoneRe = /^[+-](\d\d):?(\d\d)/

function parseDate(s?:string) {
	if (!s) return null
	let m = s.match(isoDateRe)
	if (m) {
		return Date.UTC(
			parseInt(m[1]),
			parseInt(m[2] || "1") - 1,
			parseInt(m[3] || "1"),
		)
	}
	return null
}

function isoTime(s?:string) {
	if (!s) return 0
	let m = s.match(isoTimeRe)
	if (!m) return 0
	let ms = 0
	// hours
	if (m[1]) ms += parseInt(m[1]) * msHour
	// minutes
	if (m[2]) ms += parseInt(m[2]) * msMin
	// seconds
	if (m[2]) ms += parseInt(m[3]) * 1000
	// millis
	if (m[4]) ms += parseInt((m[4] + zeros).slice(0, 3))
	return ms
}

function tzOffset(s?:string) {
	if (!s || s == "Z") return 0
	let m = s.match(isoZoneRe)
	return !m ? 0 : parseInt(m[1])*60 + parseInt(m[2])
}
