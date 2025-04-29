function setup() {
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent('canvas-container');
    calculateDerivedValues();
    calculateStationaryMarks();
}

function calculateDerivedValues() {
    slit1Y = height / 2 - slitSpacing / 2;
    slit2Y = height / 2 + slitSpacing / 2;
    graph1X = rightWallX + graphOffsetRatio * canvasWidth;
    graph2X = graph1X + graphSpacingRatio * canvasWidth;
    graph3X = graph2X + graphSpacingRatio * canvasWidth;
    markEndX = graph3X + markEndRatio * canvasWidth;
}

function calculateStationaryMarks() {
    maxPoints = [];
    minPoints = [];
    let dx = rightWallX - leftWallX;
    let combinedAmplitudes = [];
    for (let y = wallTopY; y <= wallTopY + wallHeight; y++) {
        let dy1 = y - slit1Y;
        let d1 = sqrt(dx * dx + dy1 * dy1);
        let phase1 = d1 * waveFrequency;
        let dy2 = y - slit2Y;
        let d2 = sqrt(dx * dx + dy2 * dy2);
        let phase2 = d2 * waveFrequency;
        let realSum = cos(phase1) + cos(phase2);
        let imagSum = sin(phase1) + sin(phase2);
        let amplitude = sqrt(realSum * realSum + imagSum * imagSum) * waveAmplitude;
        combinedAmplitudes.push({ y: y, amplitude: amplitude });
    }
    for (let i = 1; i < combinedAmplitudes.length - 1; i++) {
        let prev = combinedAmplitudes[i - 1].amplitude;
        let curr = combinedAmplitudes[i].amplitude;
        let next = combinedAmplitudes[i + 1].amplitude;
        if (curr > prev && curr > next) {
            maxPoints.push(combinedAmplitudes[i].y);
        }
        if (curr < prev && curr < next) {
            minPoints.push(combinedAmplitudes[i].y);
        }
    }
}

function drawWaveRay(x1, y1, x2, y2) {
    noFill();
    let dx = x2 - x1;
    let dy = y2 - y1;
    let length = dist(x1, y1, x2, y2);
    let angle = atan2(dy, dx);
    let cycleLength = TWO_PI / waveFrequency;
    let offsetShift = (-phaseShift / waveFrequency) % cycleLength;
    if (offsetShift < 0) offsetShift += cycleLength;
    let firstCycleStart = -offsetShift;
    let numCycles = ceil((length - firstCycleStart) / cycleLength);
    let baseCycleOffset = floor(-phaseShift / TWO_PI);
    for (let cycle = 0; cycle < numCycles; cycle++) {
        let startLength = firstCycleStart + cycle * cycleLength;
        let endLength = min(startLength + cycleLength, length);
        if (startLength < 0) startLength = 0;
        if (endLength <= startLength) continue;
        let steps = int((endLength - startLength) / 2);
        let colorCycleIndex = baseCycleOffset + cycle;
        if (colorCycleIndex % 2 === 0) {
            stroke(0, 150, 136);
        } else {
            stroke(255, 193, 7);
        }
        beginShape();
        for (let i = 0; i <= steps; i++) {
            let d = startLength + (i / steps) * (endLength - startLength);
            let t = d / length;
            let x = lerp(x1, x2, t);
            let y = lerp(y1, y2, t);
            let offset = sin(d * waveFrequency - phaseShift) * waveAmplitude;
            let px = x + offset * cos(angle + HALF_PI);
            let py = y + offset * sin(angle + HALF_PI);
            vertex(px, py);
        }
        endShape();
    }
}

// function drawAmplitudeGraph(slitY, graphX) {
//     let dx = rightWallX - leftWallX;
//     let cycleLength = TWO_PI / waveFrequency;
//     let offsetShift = (-phaseShift / waveFrequency) % cycleLength;
//     if (offsetShift < 0) offsetShift += cycleLength;
//     let baseCycleOffset = floor(-phaseShift / TWO_PI);
//     for (let y = wallTopY; y <= wallTopY + wallHeight; y += 1) {
//         let dy = y - slitY;
//         let d = sqrt(dx * dx + dy * dy);
//         let amplitude = sin(d * waveFrequency - phaseShift) * waveAmplitude;
//         let cycleIndex = baseCycleOffset + floor((d + offsetShift) / cycleLength);
//         if ((cycleIndex % 2) === 0) {
//             stroke(0, 150, 136);
//         } else {
//             stroke(255, 193, 7);
//         }
//         point(graphX + amplitude, y);
//     }
// }

function drawAmplitudeGraph(slitY, graphX) {
    let dx = rightWallX - leftWallX;
    let cycleLength = TWO_PI / waveFrequency;
    let offsetShift = (-phaseShift / waveFrequency) % cycleLength;
    if (offsetShift < 0) offsetShift += cycleLength;
    let baseCycleOffset = floor(-phaseShift / TWO_PI);

    let prevX = null;
    let prevY = null;

    for (let y = wallTopY; y <= wallTopY + wallHeight; y += 1) {
        let dy = y - slitY;
        let d = sqrt(dx * dx + dy * dy);
        let amplitude = sin(d * waveFrequency - phaseShift) * waveAmplitude;
        let cycleIndex = baseCycleOffset + floor((d + offsetShift) / cycleLength);

        let x = graphX + amplitude;

        if (prevX !== null && prevY !== null) {
            if ((cycleIndex % 2) === 0) {
                stroke(0, 150, 136);
            } else {
                stroke(255, 193, 7);
            }
            line(prevX, prevY, x, y);
        }

        prevX = x;
        prevY = y;
    }
}

function drawCombinedGraph(slit1Y, slit2Y, graphX) {
    let dx = rightWallX - leftWallX;
    let prevX = null;
    let prevY = null;

    for (let y = wallTopY; y <= wallTopY + wallHeight; y += 1) {
        let dy1 = y - slit1Y;
        let d1 = sqrt(dx * dx + dy1 * dy1);
        let amp1 = sin(d1 * waveFrequency - phaseShift) * waveAmplitude;
        let dy2 = y - slit2Y;
        let d2 = sqrt(dx * dx + dy2 * dy2);
        let amp2 = sin(d2 * waveFrequency - phaseShift) * waveAmplitude;
        let combined = amp1 + amp2;

        let x = graphX + combined;

        if (prevX !== null && prevY !== null) {
            let red = map(abs(combined), 0, waveAmplitude * 2, 100, 255);
            let blue = map(abs(combined), 0, waveAmplitude * 2, 255, 100);
            stroke(red, 100, blue);
            line(prevX, prevY, x, y);
        }

        prevX = x;
        prevY = y;
    }
}

function drawStationaryMarks() {
    drawingContext.setLineDash([2, 4]);
    strokeWeight(0.5);
    for (let i = 0; i < maxPoints.length; i++) {
        stroke(255, 100, 100);
        line(rightWallX, maxPoints[i], markEndX, maxPoints[i]);
    }
    for (let i = 0; i < minPoints.length; i++) {
        stroke(100);
        line(rightWallX, minPoints[i], markEndX, minPoints[i]);
    }
    drawingContext.setLineDash([]);
    strokeWeight(1);
}

function draw() {
    background(255);
    phaseCounter = (phaseCounter + 1) % phaseSteps;
    phaseShift = phaseCounter * 4 * PI / phaseSteps;
    stroke(0);
    fill(200);
    // rect(leftWallX - 10, wallTopY, 20, wallHeight);
    rect(rightWallX - 10, wallTopY, 20, wallHeight);
    fill(0);
    ellipse(leftWallX, slit1Y, 8, 8);
    ellipse(leftWallX, slit2Y, 8, 8);
    let intersectionY = constrain(mouseY, wallTopY, wallTopY + wallHeight);
    drawWaveRay(leftWallX, slit1Y, rightWallX, intersectionY);
    drawWaveRay(leftWallX, slit2Y, rightWallX, intersectionY);
    noStroke();
    fill(50, 50, 200);
    ellipse(rightWallX, intersectionY, 10, 10);
    drawAmplitudeGraph(slit1Y, graph1X);
    drawAmplitudeGraph(slit2Y, graph2X);
    drawCombinedGraph(slit1Y, slit2Y, graph3X);
    stroke(0);
    line(graph1X, wallTopY, graph1X, wallTopY + wallHeight);
    line(graph2X, wallTopY, graph2X, wallTopY + wallHeight);
    line(graph3X, wallTopY, graph3X, wallTopY + wallHeight);
    drawStationaryMarks();
}

function updateParameters() {
    rightWallX = parseInt(document.getElementById('wallDistance').value);
    slitSpacing = parseInt(document.getElementById('slitSpacing').value);
    waveAmplitude = parseFloat(document.getElementById('waveAmplitude').value);
    waveFrequency = parseFloat(document.getElementById('waveFrequency').value);

    calculateDerivedValues();
    calculateStationaryMarks();

    document.getElementById('wallDistanceValue').textContent = rightWallX;
    document.getElementById('slitSpacingValue').textContent = slitSpacing;
    document.getElementById('waveAmplitudeValue').textContent = waveAmplitude.toFixed(1);
    document.getElementById('waveFrequencyValue').textContent = waveFrequency.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('wallDistance').addEventListener('input', updateParameters);
    document.getElementById('slitSpacing').addEventListener('input', updateParameters);
    document.getElementById('waveAmplitude').addEventListener('input', updateParameters);
    document.getElementById('waveFrequency').addEventListener('input', updateParameters);
});

