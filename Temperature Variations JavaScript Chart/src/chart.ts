/*
 * LightningChartJS example that showcases a simulation of daily temperature variations.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, AxisTickStrategies, SolidFill, SolidLine, ColorRGBA, ColorHEX, LegendBoxBuilders, LinearGradientFill, Themes } =
    lcjs

// Create a XY Chart.
const chart = lightningChart({license: '0002-aAgQt777ulf8GBrj/+3CiDwJJ85sBwAJELGq47hD-MEUCIDpBIa0oWQ6OVJJjLAlFlFj0gj41uUyLHJS1jZzngeJIAiEAuBX15C5WnqrehXGhCFVVADA8v6okC3Ff54m9ogK5r0Y='}).ChartXY({
    theme: Themes.cyberSpace,
}).setTitle('Daily temperature range, April 2019')

const axisX = chart.getDefaultAxisX()
const axisY = chart.getDefaultAxisY().setTitle('Temperature (°C)').setScrollStrategy(undefined)

// Use DateTime TickStrategy and set the interval
axisX.setTickStrategy(AxisTickStrategies.DateTime)
    .setInterval({
        start: new Date(2019, 0, 1).getTime(),
        end: new Date(2019, 0, 31).getTime()
    })

// Daily temperature records
const recordRange = chart.addAreaRangeSeries()
// Current month daily temperature variations
const currentRange = chart.addAreaRangeSeries()
// ----- Series stylings
// Temperature records fill style, gradient Red - Blue scale.
const recordRangeFillStyle = new LinearGradientFill({
    angle: 0,
    stops: [
        { color: ColorHEX('#0000FF9F'), offset: 0 },
        { color: ColorHEX('#FF00009F'), offset: 1 },
    ],
})
// Record range stroke fill style, high line
const recordRangeStrokeFillStyleHigh = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(250, 91, 70) }))
// Record range stroke fill style, low line
const recordRangeStrokeFillStyleLow = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(63, 138, 250) }))
// Current month temperature fill style
const currentRangeFillStyle = new SolidFill({ color: ColorRGBA(255, 174, 0, 200) })
// Current range stroke fill style
const currentRangeStrokeFillStyle = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(250, 226, 105) }))
// ----- Applying stylings
// Record range
recordRange
    .setName('Temperature records range')
    .setHighFillStyle(recordRangeFillStyle)
    // Same fill style for the highlighted series
    .setHighStrokeStyle(recordRangeStrokeFillStyleHigh)
    .setLowStrokeStyle(recordRangeStrokeFillStyleLow)
// Current range
currentRange
    .setName('2019 temperatures')
    .setHighFillStyle(currentRangeFillStyle)
    .setHighStrokeStyle(currentRangeStrokeFillStyle)
    .setLowStrokeStyle(currentRangeStrokeFillStyle)

// ----- Result tables settings
// Record range
recordRange.setCursorResultTableFormatter((builder, series, figure, yMax, yMin) => {
    return builder
        .addRow('Temperature records range')
        .addRow('Date: ' + axisX.formatValue(figure))
        .addRow('Highest: ' + yMax.toFixed(2) + ' °C')
        .addRow('Lowest: ' + yMin.toFixed(2) + ' °C')
})
// Current range
currentRange.setCursorResultTableFormatter((builder, series, figure, yMax, yMin) => {
    return builder
        .addRow('2019 temperatures')
        .addRow('Date: ' + axisX.formatValue(figure))
        .addRow('Highest: ' + yMax.toFixed(2) + ' °C')
        .addRow('Lowest: ' + yMin.toFixed(2) + ' °C')
})
// ----- Generating data
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
const currentRangeData = []
const recordRangeData = []
// Current range
for (let i = 0; i < 31; i++) {
    const randomPoint = () => {
        const x = new Date(2019, 0, i + 1).getTime()
        let yMax
        if (i > 0) {
            const previousYMax = currentRangeData[i - 1].yMax
            yMax = randomInt(previousYMax - 5, previousYMax + 5)
        } else {
            yMax = randomInt(-5, 25)
        }
        const yMin = randomInt(yMax - 5, yMax) - 5
        return {
            x,
            yMax,
            yMin,
        }
    }
    currentRangeData.push(randomPoint())
}

let recordYMax = currentRangeData[0].yMax
let recordYMin = currentRangeData[0].yMin
for (let i = 1; i < currentRangeData.length; i++) {
    if (currentRangeData[i].yMin < recordYMin) recordYMin = currentRangeData[i].yMin
    if (currentRangeData[i].yMax > recordYMax) recordYMax = currentRangeData[i].yMax
}
// Set series interval
axisY.setInterval({ start: recordYMin - 5, end: recordYMax + 5, stopAxisAfter: false })
// ----- Generate record temperatures
for (let i = 0; i < 31; i++) {
    const randomPoint = () => {
        const x = new Date(2019, 0, i + 1).getTime()
        const yMax = randomInt(recordYMax - 2, recordYMax + 2)
        const yMin = randomInt(recordYMin - 1, recordYMin)
        return {
            x,
            yMax,
            yMin,
        }
    }
    recordRangeData.push(randomPoint())
}
// ----- Adding data points
recordRangeData.forEach((point, i) => {
    recordRange.add({ position: point.x, high: point.yMax, low: point.yMin })
})

currentRangeData.forEach((point, i) => {
    currentRange.add({ position: point.x, high: point.yMax, low: point.yMin })
})
// ----- Add legend box
const legendBox = chart
    .addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.8,
    })

legendBox.add(chart)
